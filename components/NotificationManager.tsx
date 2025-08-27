import { NotificationData } from '@/types/websocket';
import React, { useState, useCallback, useRef, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import NotificationBanner from './NotificationBanner';

interface NotificationManagerProps {
  notifications: NotificationData[];
  maxVisible?: number;
  onNotificationDismiss?: (id: string) => void;
}

interface ActiveNotification extends NotificationData {
  key: string;
  displayTime: number;
}

const NotificationManager: React.FC<NotificationManagerProps> = memo(({
  notifications,
  maxVisible = 3,
  onNotificationDismiss
}) => {
  const [activeNotifications, setActiveNotifications] = useState<ActiveNotification[]>([]);
  const notificationQueue = useRef<NotificationData[]>([]);
  const displayedIds = useRef<Set<string>>(new Set());

  // 处理新通知
  React.useEffect(() => {
    const newNotifications = notifications.filter(notification => 
      !displayedIds.current.has(notification.id)
    );

    if (newNotifications.length === 0) return;

    // 添加到队列
    notificationQueue.current.push(...newNotifications);
    
    // 标记为已处理
    newNotifications.forEach(notification => {
      displayedIds.current.add(notification.id);
    });

    // 处理队列
    processQueue();
  }, [notifications]);

  const processQueue = useCallback(() => {
    if (notificationQueue.current.length === 0) return;
    if (activeNotifications.length >= maxVisible) return;

    const notification = notificationQueue.current.shift()!;
    const activeNotification: ActiveNotification = {
      ...notification,
      key: `${notification.id}-${Date.now()}`,
      displayTime: Date.now()
    };

    setActiveNotifications(prev => [...prev, activeNotification]);

    // 继续处理队列
    setTimeout(() => processQueue(), 100);
  }, [activeNotifications.length, maxVisible]);

  const handleDismiss = useCallback((key: string) => {
    setActiveNotifications(prev => {
      const notification = prev.find(n => n.key === key);
      if (notification && onNotificationDismiss) {
        onNotificationDismiss(notification.id);
      }
      return prev.filter(n => n.key !== key);
    });

    // 处理队列中的下一个通知
    setTimeout(() => processQueue(), 300);
  }, [onNotificationDismiss, processQueue]);

  // 清理过期的显示记录
  React.useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      const expiredTime = 5 * 60 * 1000; // 5分钟
      
      // 清理显示记录，防止内存泄漏
      const currentIds = new Set(notifications.map(n => n.id));
      displayedIds.current = new Set(
        Array.from(displayedIds.current).filter(id => currentIds.has(id))
      );
    };

    const timer = setInterval(cleanup, 60000); // 每分钟清理一次
    return () => clearInterval(timer);
  }, [notifications]);

  return (
    <View style={styles.container}>
      {activeNotifications.map((notification, index) => (
        <View 
          key={notification.key} 
          style={[styles.notificationWrapper, { top: 50 + index * 80 }]}
        >
          <NotificationBanner
            notification={notification}
            onDismiss={() => handleDismiss(notification.key)}
          />
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  notificationWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1001,
  },
});

NotificationManager.displayName = 'NotificationManager';

export default NotificationManager;