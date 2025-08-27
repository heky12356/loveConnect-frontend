import wsManager from '@/api/websocketManager';
import { NotificationData } from '@/types/websocket';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface WebSocketContextType {
  isConnected: boolean;
  notifications: NotificationData[];
  connectionState: number;
  sendMessage: (message: any) => void;
  clearNotifications: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [connectionState, setConnectionState] = useState<any>(WebSocket.CLOSED);

  useEffect(() => {
    // 连接事件监听
    const handleConnected = () => {
      setIsConnected(true);
      setConnectionState(WebSocket.OPEN);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setConnectionState(WebSocket.CLOSED);
    };

    const handleError = (error: any) => {
      console.error('WebSocket 错误:', error);
      setConnectionState(WebSocket.CLOSED);
    };

    // 通知消息处理
    const handleNotification = (data: NotificationData) => {
      setNotifications(prev => [data, ...prev].slice(0, 50)); // 保留最新50条
      
      // 可以在这里集成推送通知
      // showPushNotification(data);
    };

    // 注册事件监听器
    wsManager.on('connected', handleConnected);
    wsManager.on('disconnected', handleDisconnected);
    wsManager.on('error', handleError);
    wsManager.on('notification', handleNotification);

    // 初始化连接
    wsManager.connect();

    // 清理函数
    return () => {
      wsManager.off('connected', handleConnected);
      wsManager.off('disconnected', handleDisconnected);
      wsManager.off('error', handleError);
      wsManager.off('notification', handleNotification);
    };
  }, []);

  const sendMessage = (message: any) => {
    wsManager.send(message);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <WebSocketContext.Provider value={{
      isConnected,
      notifications,
      connectionState,
      sendMessage,
      clearNotifications
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};