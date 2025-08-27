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
}