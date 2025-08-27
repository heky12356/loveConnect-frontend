import { NotificationData, WebSocketMessage } from '@/types/websocket';

class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private listeners: Map<string, Function[]> = new Map();
  private isConnecting = false;

  constructor(url: string) {
    this.url = url;
  }

  // 连接 WebSocket
  connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    console.log('正在连接 WebSocket...');

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket 连接成功');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connected', null);
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

      this.ws.onclose = () => {
        console.log('WebSocket 连接关闭');
        this.isConnecting = false;
        this.emit('disconnected', null);
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket 错误:', error);
        this.isConnecting = false;
        this.emit('error', error);
      };
    } catch (error) {
      console.error('WebSocket 连接失败:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  // 断开连接
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // 发送消息
  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket 未连接，无法发送消息');
    }
  }

  // 重连机制
  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval * this.reconnectAttempts);
    } else {
      console.error('达到最大重连次数，停止重连');
    }
  }

  // 处理接收到的消息
  private handleMessage(message: WebSocketMessage) {
    this.emit(message.type, message.data);
    
    // 处理通知类型消息
    if (message.type === 'notification') {
      this.handleNotification(message.data);
    }
  }

  // 处理通知
  private handleNotification(data: NotificationData) {
    this.emit('notification', data);
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

  // 获取连接状态
  getConnectionState() {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }
}

// 创建全局实例
const wsManager = new WebSocketManager('ws://your-server.com/ws');
export default wsManager;