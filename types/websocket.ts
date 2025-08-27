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

// 心跳配置
export interface HeartbeatConfig {
  interval: number;
  timeout: number;
  maxMissed: number;
}