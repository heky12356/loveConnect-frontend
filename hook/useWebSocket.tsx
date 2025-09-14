import { log } from '@/api/config';
import wsManager, { AiChatRequest, AiChatResponse } from '@/api/websocketManager';
import { ConnectionState, NotificationData, WebSocketError, WebSocketState } from '@/types/websocket';
import { notificationUtils } from '@/utils/notificationUtils';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface NotificationStats {
  total: number;
  unread: number;
  duplicatesFiltered: number;
  cacheSize: number;
}

interface WebSocketContextType {
  // 连接状态
  isConnected: boolean;
  connectionState: ConnectionState;
  reconnectAttempts: number;
  lastConnectedAt: number | null;
  error: WebSocketError | null;
  
  // 通知管理
  notifications: NotificationData[];
  unreadCount: number;
  
  // 方法
  sendMessage: (message: any) => Promise<boolean>;
  sendChatMessage: (message: AiChatRequest) => Promise<boolean>;
  onChatResponse: (callback: (response: AiChatResponse) => void) => void;
  offChatResponse: (callback: (response: AiChatResponse) => void) => void;
  clearNotifications: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  retryConnection: () => Promise<void>;
  clearError: () => void;
  getNotificationStats: () => NotificationStats;
  clearNotificationCache: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [wsState, setWsState] = useState<WebSocketState>({
    isConnected: false,
    connectionState: ConnectionState.CLOSED,
    error: null,
    reconnectAttempts: 0,
    lastConnectedAt: null
  });
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 状态变化处理
    const handleStateChange = (newState: WebSocketState) => {
      setWsState(newState);
    };

    // 通知消息处理
    const handleNotification = (data: NotificationData) => {
      const notificationWithTimestamp = {
        ...data,
        timestamp: data.timestamp || Date.now()
      };
      
      setNotifications(prev => {
        console.log('添加通知前，当前通知数量:', prev.length);
        console.log('新通知ID:', notificationWithTimestamp.id);
        
        // 检查是否已存在相同ID的通知
        const exists = prev.some(n => n.id === notificationWithTimestamp.id);
        if (exists) {
          console.log('通知ID已存在，跳过添加');
          return prev;
        }
        
        // 添加新通知，暂时跳过processNotifications去重逻辑
        const newNotifications = [notificationWithTimestamp, ...prev];
        console.log('添加通知后，通知数量:', newNotifications.length);
        
        // 保留最新50条
        return newNotifications.slice(0, 50);
      });
      
      // 可以在这里集成推送通知
      // showPushNotification(notificationWithTimestamp);
    };

    // 错误处理
    const handleError = (error: WebSocketError) => {
      log.error('WebSocket 错误:', error);
      
      // 根据错误类型显示不同的用户提示
      switch (error.type) {
        case 'network':
          log.warn('网络连接问题，正在尝试重连...');
          break;
        case 'authentication':
          log.error('认证失败，请重新登录');
          break;
        case 'server':
          log.error('服务器错误，请稍后重试');
          break;
        default:
          log.error('未知错误:', error.message);
      }
    };

    // AI问候消息处理
    const handleAiGreeting = (greetingMessage: any) => {
      log.debug('收到AI问候消息:', greetingMessage);
      // AI问候消息已经在WebSocket管理器中转换为通知，这里可以做额外处理
    };

    // 注册事件监听器
    wsManager.onStateChange(handleStateChange);
    wsManager.on('notification', handleNotification);
    wsManager.on('ai_greeting', handleAiGreeting);
    wsManager.on('error', handleError);

    // 初始化连接
    wsManager.connect().catch(error => {
      log.error('初始化连接失败:', error);
    });

    // 清理函数
    return () => {
      wsManager.offStateChange(handleStateChange);
      wsManager.off('notification', handleNotification);
      wsManager.off('ai_greeting', handleAiGreeting);
      wsManager.off('error', handleError);
    };
  }, []);

  // 发送消息
  const sendMessage = useCallback(async (message: any): Promise<boolean> => {
    try {
      return await wsManager.send(message);
    } catch (error) {
      log.error('发送消息失败:', error);
      return false;
    }
  }, []);

  // 清空通知
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setReadNotifications(new Set());
  }, []);

  // 标记通知为已读
  const markNotificationAsRead = useCallback((id: string) => {
    setReadNotifications(prev => new Set([...prev, id]));
  }, []);

  // 标记所有通知为已读
  const markAllNotificationsAsRead = useCallback(() => {
    const allIds = notifications.map(n => n.id);
    setReadNotifications(new Set(allIds));
  }, [notifications]);

  // 重试连接
  const retryConnection = useCallback(async (): Promise<void> => {
    try {
      await wsManager.connect();
    } catch (error) {
      log.error('重试连接失败:', error);
      throw error;
    }
  }, []);

  // 清除错误
  const clearError = useCallback(() => {
    setWsState(prev => ({ ...prev, error: null }));
  }, []);

  // 计算未读通知数量
  const unreadCount = notifications.filter(n => !readNotifications.has(n.id)).length;

  // 获取通知统计信息
  const getNotificationStats = useCallback(() => {
    const stats = notificationUtils.getDeduplicationStats();
    return {
      total: notifications.length,
      unread: unreadCount,
      duplicatesFiltered: stats.duplicateCount,
      cacheSize: stats.totalCached
    };
  }, [notifications.length, unreadCount]);

  // 清理通知缓存
  const clearNotificationCache = useCallback(() => {
    notificationUtils.clearDeduplicationCache();
  }, []);

  // 发送AI聊天消息
  const sendChatMessage = useCallback(async (message: AiChatRequest): Promise<boolean> => {
    try {
      return await wsManager.sendChatMessage(message);
    } catch (error) {
      log.error('发送AI聊天消息失败:', error);
      return false;
    }
  }, []);

  // 监听AI聊天响应
  const onChatResponse = useCallback((callback: (response: AiChatResponse) => void) => {
    wsManager.onChatResponse(callback);
  }, []);

  // 取消监听AI聊天响应
  const offChatResponse = useCallback((callback: (response: AiChatResponse) => void) => {
    wsManager.offChatResponse(callback);
  }, []);

  return (
    <WebSocketContext.Provider value={{
      isConnected: wsState.isConnected,
      connectionState: wsState.connectionState,
      error: wsState.error,
      reconnectAttempts: wsState.reconnectAttempts,
      lastConnectedAt: wsState.lastConnectedAt,
      notifications,
      unreadCount,
      sendMessage,
      sendChatMessage,
      onChatResponse,
      offChatResponse,
      clearNotifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      retryConnection,
      clearError,
      getNotificationStats,
      clearNotificationCache
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