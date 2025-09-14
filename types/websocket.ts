export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp?: number;
  aiName?: string; // 用于标识哪个AI发送了消息
  data?: any; // 额外的数据字段
}

// AI问候消息接口
export interface AiGreetingMessage {
  code: number;
  msg: string;
  data: {
    type: 'ai_greeting';
    aiText: string;
    aiVoiceUrl: string;
    aiVoiceBase64: string;
    aiRoleId: string;
  };
}

// WebSocket连接状态
export enum ConnectionState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3
}

// 错误类型定义
export interface WebSocketError {
  type: 'network' | 'authentication' | 'server' | 'unknown';
  message: string;
  code?: number;
  timestamp: number;
}

// 消息队列项
export interface QueuedMessage {
  id: string;
  message: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

// WebSocket状态
export interface WebSocketState {
  isConnected: boolean;
  connectionState: ConnectionState;
  error: WebSocketError | null;
  reconnectAttempts: number;
  lastConnectedAt: number | null;
}