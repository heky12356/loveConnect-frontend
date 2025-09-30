import {
  AiGreetingMessage,
  ConnectionState,
  NotificationData,
  QueuedMessage,
  WebSocketError,
  WebSocketMessage,
  WebSocketState
} from '@/types/websocket';
import { config, isDevelopment } from './config';

// AI聊天请求消息接口
export interface AiChatRequest {
  type: 'user_voice' | 'user_text';
  voiceBase64?: string;
  text?: string;
  aiRoleId: string;
  phone: string;
}

// AI聊天响应消息接口
export interface AiChatResponse {
  code: number;
  msg: string;
  data: {
    type: 'ai_response';
    userText: string;
    aiText: string;
    aiVoiceBase64?: string;
    aiRoleId: string;
  };
}

// WebSocket管理器接口
export interface WebSocketManager {
  connect(): Promise<void>;
  disconnect(): void;
  send(message: any): Promise<boolean>;
  sendChatMessage(message: AiChatRequest): Promise<boolean>;
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  onChatResponse(callback: (response: AiChatResponse) => void): void;
  offChatResponse(callback: (response: AiChatResponse) => void): void;
  getConnectionState(): ConnectionState;
  getState(): WebSocketState;
  isConnected(): boolean;
  clearMessageQueue(): void;
  onStateChange(callback: (state: WebSocketState) => void): void;
  offStateChange(callback: (state: WebSocketState) => void): void;
}

// 生产环境WebSocket管理器实现
class WebSocketManagerImpl implements WebSocketManager {
  private static instance: WebSocketManagerImpl | null = null;
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = config.websocket.reconnectAttempts;
  private reconnectInterval = config.websocket.reconnectInterval;
  private listeners: Map<string, Function[]> = new Map();
  private stateChangeListeners: Function[] = [];
  private isConnecting = false;
  private connectionPromise: Promise<void> | null = null;
  private messageQueue: QueuedMessage[] = [];
  private state: WebSocketState;


  private constructor(url: string) {
    this.url = url;
    this.state = {
      isConnected: false,
      connectionState: ConnectionState.CLOSED,
      error: null,
      reconnectAttempts: 0,
      lastConnectedAt: null
    };
  }
  onChatResponse(callback: (response: AiChatResponse) => void): void {
    this.on('chat_response', callback);
  }
  offChatResponse(callback: (response: AiChatResponse) => void): void {
    this.off('chat_response', callback);
  }

  static getInstance(url?: string, uid?: string): WebSocketManagerImpl {
    // 使用配置文件中的 WebSocket URL
    const baseUrl = url || config.websocket.url;
    const fullUrl = uid ? `${baseUrl}/${uid}` : baseUrl;

    console.log('WebSocket URL:', fullUrl);

    if (!WebSocketManagerImpl.instance) {
      WebSocketManagerImpl.instance = new WebSocketManagerImpl(fullUrl);
    } else if (WebSocketManagerImpl.instance.url !== fullUrl) {
      // 如果URL发生变化，重新创建实例
      WebSocketManagerImpl.instance.disconnect();
      WebSocketManagerImpl.instance = new WebSocketManagerImpl(fullUrl);
    }
    return WebSocketManagerImpl.instance;
  }

  // 连接 WebSocket
  async connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    this.connectionPromise = this.establishConnection();
    return this.connectionPromise;
  }

  private async establishConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting) {
        reject(new Error('连接正在进行中'));
        return;
      }

      this.isConnecting = true;
      this.updateState({ connectionState: ConnectionState.CONNECTING });
      console.log('正在连接 WebSocket...');

      try {
        this.ws = new WebSocket(this.url);

        const connectionTimeout = setTimeout(() => {
          if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
            this.ws.close();
            this.handleConnectionError({
              type: 'network',
              message: '连接超时',
              timestamp: Date.now()
            });
            reject(new Error('连接超时'));
          }
        }, 10000); // 10秒超时

        this.ws.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log('WebSocket 连接成功');
          this.isConnecting = false;
          this.connectionPromise = null;
          this.reconnectAttempts = 0;
          
          this.updateState({
            isConnected: true,
            connectionState: ConnectionState.OPEN,
            error: null,
            reconnectAttempts: 0,
            lastConnectedAt: Date.now()
          });
          
          this.flushMessageQueue();
          this.emit('connected', null);
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            console.log('收到消息:', message);
            
            this.handleMessage(message);
          } catch (error) {
            console.error('解析消息失败:', error);
          }
        };

        this.ws.onclose = (event) => {
          clearTimeout(connectionTimeout);
          console.log('WebSocket 连接关闭', event.code, event.reason);
          this.isConnecting = false;
          this.connectionPromise = null;
          
          this.updateState({
            isConnected: false,
            connectionState: ConnectionState.CLOSED
          });
          
          this.emit('disconnected', { code: event.code, reason: event.reason });
          
          // 非正常关闭时尝试重连
          if (event.code !== 1000) {
            this.attemptReconnect();
          }
          
          if (this.reconnectAttempts === 0) {
            resolve(); // 首次连接成功后的正常关闭
          }
        };

        this.ws.onerror = (error) => {
          clearTimeout(connectionTimeout);
          console.error('WebSocket 错误:', error);
          this.isConnecting = false;
          this.connectionPromise = null;
          
          const wsError: WebSocketError = {
            type: 'network',
            message: 'WebSocket连接错误',
            timestamp: Date.now()
          };
          
          this.handleConnectionError(wsError);
          reject(error);
        };
      } catch (error) {
        console.error('WebSocket 连接失败:', error);
        this.isConnecting = false;
        this.connectionPromise = null;
        
        const wsError: WebSocketError = {
          type: 'unknown',
          message: error instanceof Error ? error.message : '未知错误',
          timestamp: Date.now()
        };
        
        this.handleConnectionError(wsError);
        reject(error);
      }
    });
  }

  // 断开连接
  disconnect() {
    this.connectionPromise = null;
    
    if (this.ws) {
      this.ws.close(1000, '主动断开连接');
      this.ws = null;
    }
    
    this.updateState({
      isConnected: false,
      connectionState: ConnectionState.CLOSED,
      error: null
    });
  }

  // 发送消息
  async send(message: any): Promise<boolean> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('发送消息失败:', error);
        this.queueMessage(message);
        return false;
      }
    } else {
      console.warn('WebSocket 未连接，消息已加入队列');
      this.queueMessage(message);
      return false;
    }
  }

  // 发送AI聊天消息
  async sendChatMessage(message: AiChatRequest): Promise<boolean> {
    console.log('发送AI聊天消息:', message);
    return await this.send(message);
  }

  // 检查是否已连接
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  // 获取连接状态
  getConnectionState(): ConnectionState {
    if (!this.ws) return ConnectionState.CLOSED;
    return this.ws.readyState as ConnectionState;
  }

  // 获取完整状态
  getState(): WebSocketState {
    return { ...this.state };
  }

  // 清空消息队列
  clearMessageQueue(): void {
    this.messageQueue = [];
  }

  // 状态变化监听
  onStateChange(callback: (state: WebSocketState) => void): void {
    this.stateChangeListeners.push(callback);
  }

  offStateChange(callback: (state: WebSocketState) => void): void {
    const index = this.stateChangeListeners.indexOf(callback);
    if (index > -1) {
      this.stateChangeListeners.splice(index, 1);
    }
  }

  // 重连机制
  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.updateState({ reconnectAttempts: this.reconnectAttempts });
      
      console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(async () => {
        try {
          await this.connect();
        } catch (error) {
          console.error('重连失败:', error);
        }
      }, this.reconnectInterval * this.reconnectAttempts);
    } else {
      console.error('达到最大重连次数，停止重连');
      const error: WebSocketError = {
        type: 'network',
        message: '达到最大重连次数，连接失败',
        timestamp: Date.now()
      };
      this.handleConnectionError(error);
    }
  }

  // 处理接收到的消息
  private handleMessage(message: any) {
    // 检查是否是标准的WebSocketMessage格式
    if (message.type && message.data !== undefined) {
      this.emit(message.type, message.data);
      
      // 处理通知类型消息
      if (message.type === 'notification') {
        this.handleNotification(message.data);
      }
    } 
    // 检查是否是AI聊天响应格式（后端直接返回的格式）
    else if (message.code !== undefined && message.msg !== undefined && message.data && message.data.type === 'ai_response') {
      // 将后端格式转换为前端期望的格式并触发chat_response事件
      console.log('检测到AI聊天响应，转换格式:', message);
      this.emit('chat_response', message);
    }
    // 检查是否是AI问候消息格式
    else if (message.code !== undefined && message.msg !== undefined && message.data && message.data.type === 'ai_greeting') {
      console.log('检测到AI问候消息:', message);
      this.handleAiGreeting(message as AiGreetingMessage);
    }
    // 其他格式的消息
    else {
      console.warn('收到未知格式的消息:', message);
    }
  }

  // 处理通知
  private handleNotification(data: NotificationData) {
    this.emit('notification', data);
  }

  // 处理AI问候消息
  private handleAiGreeting(message: AiGreetingMessage) {
    // 将AI问候消息转换为通知格式
    const notification: NotificationData = {
      id: `greeting_${Date.now()}_${message.data.aiRoleId}`,
      title: 'AI问候',
      message: message.data.aiText,
      type: 'info',
      timestamp: Date.now(),
      aiName: message.data.aiRoleId,
      data: {
        type: 'ai_greeting',
        aiText: message.data.aiText,
        aiVoiceUrl: message.data.aiVoiceUrl,
        aiVoiceBase64: message.data.aiVoiceBase64,
        aiRoleId: message.data.aiRoleId
      }
    };
    
    // 触发问候事件和通知事件
    this.emit('ai_greeting', message);
    this.emit('notification', notification);
  }

  // 事件监听器
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // 移除事件监听器
  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  // 触发事件
  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // 私有辅助方法
  private updateState(updates: Partial<WebSocketState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyStateChange();
  }

  private notifyStateChange(): void {
    this.stateChangeListeners.forEach(callback => {
      try {
        callback(this.getState());
      } catch (error) {
        console.error('状态变化回调执行失败:', error);
      }
    });
  }

  private handleConnectionError(error: WebSocketError): void {
    this.updateState({ error });
    this.emit('error', error);
  }

  private queueMessage(message: any): void {
    const queuedMessage: QueuedMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      message,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3
    };
    
    this.messageQueue.push(queuedMessage);
    
    // 限制队列大小
    if (this.messageQueue.length > 100) {
      this.messageQueue.shift();
    }
  }

  private async flushMessageQueue(): Promise<void> {
    const messages = [...this.messageQueue];
    this.messageQueue = [];
    
    for (const queuedMessage of messages) {
      try {
        const success = await this.send(queuedMessage.message);
        if (!success && queuedMessage.retryCount < queuedMessage.maxRetries) {
          queuedMessage.retryCount++;
          this.messageQueue.push(queuedMessage);
        }
      } catch (error) {
        console.error('发送队列消息失败:', error);
      }
    }
  }
}

// 模拟WebSocket管理器实现
class WebSocketManagerMock implements WebSocketManager {
  private static instance: WebSocketManagerMock | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private stateChangeListeners: Function[] = [];
  private connected = false;
  private state: WebSocketState;
  private messageQueue: QueuedMessage[] = [];
  private mockResponses: AiChatResponse[] = [
    {
      code: 200,
      msg: '处理成功',
      data: {
        type: 'ai_response',
        userText: '你好',
        aiText: '你好！很高兴见到你，有什么我可以帮助你的吗？',
        aiRoleId: 'mock-ai-1'
      }
    },
    {
      code: 200,
      msg: '处理成功',
      data: {
        type: 'ai_response',
        userText: '今天天气怎么样？',
        aiText: '今天天气很不错，阳光明媚，适合外出活动。',
        aiVoiceBase64: 'mock-voice-base64-data',
        aiRoleId: 'mock-ai-1'
      }
    }
  ];

  private constructor() {
    this.state = {
      isConnected: false,
      connectionState: ConnectionState.CLOSED,
      error: null,
      reconnectAttempts: 0,
      lastConnectedAt: null
    };
  }
  onChatResponse(callback: (response: AiChatResponse) => void): void {
    this.on('chat_response', callback);
  }
  offChatResponse(callback: (response: AiChatResponse) => void): void {
    this.off('chat_response', callback);
  }

  static getInstance(): WebSocketManagerMock {
    if (!WebSocketManagerMock.instance) {
      WebSocketManagerMock.instance = new WebSocketManagerMock();
    }
    return WebSocketManagerMock.instance;
  }

  async connect(): Promise<void> {
    console.log('[Mock] 模拟WebSocket连接中...');
    return new Promise((resolve) => {
      this.updateState({ connectionState: ConnectionState.CONNECTING });
      
      setTimeout(() => {
        this.connected = true;
        console.log('[Mock] WebSocket连接成功');
        this.updateState({
          isConnected: true,
          connectionState: ConnectionState.OPEN,
          error: null,
          lastConnectedAt: Date.now()
        });
        this.emit('connected', null);
        resolve();
      }, 1000);
    });
  }

  disconnect(): void {
    console.log('[Mock] 断开WebSocket连接');
    this.connected = false;
    this.updateState({
      isConnected: false,
      connectionState: ConnectionState.CLOSED,
      error: null
    });
    this.emit('disconnected', null);
  }

  async send(message: any): Promise<boolean> {
    if (!this.connected) {
      console.warn('[Mock] WebSocket未连接，消息已加入队列');
      this.queueMessage(message);
      return false;
    }
    
    console.log('[Mock] 发送消息:', message);
    
    // 模拟将发送的消息转换为AI响应格式的通知事件
    if (message && message.type === 'info' && message.aiName) {
      setTimeout(() => {
        const aiResponse = {
          id: message.id, // 保持原始消息的ID
          code: 200,
          msg: '消息发送成功',
          title: message.title || '新消息',
          message: message.message || '测试消息',
          type: message.type || 'info',
          timestamp: message.timestamp || Date.now(),
          aiName: message.aiName,
          data: {
            type: 'ai_response',
            userText: message.message || '测试消息',
            aiText: `收到来自${message.aiName}的消息: ${message.message}`,
            aiRoleId: message.aiName || message.data?.aiName || 'mock-ai-1',
            timestamp: message.timestamp || Date.now(),
            aiName: message.aiName
          }
        };
        console.log('[Mock] 触发AI响应格式的通知事件:', aiResponse);
        this.emit('notification', aiResponse);
      }, 500); // 模拟网络延迟
    }
    
    return true;
  }

  async sendChatMessage(message: AiChatRequest): Promise<boolean> {
    console.log('[Mock] 发送聊天消息:', message);
    
    const success = await this.send(message);
    
    if (success) {
      // 模拟网络延迟
      setTimeout(() => {
        const randomResponse = this.mockResponses[Math.floor(Math.random() * this.mockResponses.length)];
        const response: AiChatResponse = {
          ...randomResponse,
          data: {
            ...randomResponse.data,
            aiRoleId: message.aiRoleId,
            userText: message.type === 'user_text' ? (message.text || '') : '语音消息',
            type: 'ai_response'
          }
        };
        
        console.log('[Mock] 收到AI回复:', response);
        this.emit('chat_response', response);
      }, 1500 + Math.random() * 1000);
    } else {
      this.emit('error', { message: 'WebSocket未连接' });
    }
    
    return success;
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  getConnectionState(): ConnectionState {
    return this.connected ? ConnectionState.OPEN : ConnectionState.CLOSED;
  }

  getState(): WebSocketState {
    return { ...this.state };
  }

  isConnected(): boolean {
    return this.connected;
  }

  clearMessageQueue(): void {
    this.messageQueue = [];
  }

  onStateChange(callback: (state: WebSocketState) => void): void {
    this.stateChangeListeners.push(callback);
  }

  offStateChange(callback: (state: WebSocketState) => void): void {
    const index = this.stateChangeListeners.indexOf(callback);
    if (index > -1) {
      this.stateChangeListeners.splice(index, 1);
    }
  }

  private updateState(updates: Partial<WebSocketState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyStateChange();
  }

  private notifyStateChange(): void {
    this.stateChangeListeners.forEach(callback => {
      try {
        callback(this.getState());
      } catch (error) {
        console.error('状态变化回调执行失败:', error);
      }
    });
  }

  private queueMessage(message: any): void {
    const queuedMessage: QueuedMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      message,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3
    };
    
    this.messageQueue.push(queuedMessage);
    
    // 限制队列大小
    if (this.messageQueue.length > 100) {
      this.messageQueue.shift();
    }
  }
}

// 根据配置文件决定使用哪个实现
export function getWebSocketManager(uid?: string): WebSocketManager {
  if (isDevelopment() || config.features.enableMockData) {
    return WebSocketManagerMock.getInstance();
  } else {
    // 如果没有提供 uid，尝试从 AsyncStorage 获取当前用户信息
    if (!uid) {
      // 在实际使用时，可以从 AuthContext 或 AsyncStorage 获取用户ID
      // 这里先使用默认用户ID，实际项目中应该传入真实的用户ID
      console.warn('WebSocket 连接缺少用户ID，使用默认值。建议传入当前用户ID。');
    }
    return WebSocketManagerImpl.getInstance(config.websocket.url, uid);
  }
}

// 提供一个带用户ID的 WebSocket 实例获取方法
export function getWebSocketManagerWithUser(userPhone: string): WebSocketManager {
  return getWebSocketManager(userPhone);
}

// 默认导出不带参数的实例，保持向后兼容
export default getWebSocketManager();