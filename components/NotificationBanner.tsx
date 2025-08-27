import { NotificationData } from '@/types/websocket';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text } from 'react-native';

const { width } = Dimensions.get('window');

interface NotificationBannerProps {
  notification: NotificationData;
  onDismiss: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = memo(({ notification, onDismiss }) => {
  const [slideAnim] = useState(new Animated.Value(-100));
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDismissedRef = useRef(false);

  useEffect(() => {
    // 防止重复显示
    if (isDismissedRef.current) return;

    // 滑入动画
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // 根据通知类型设置不同的显示时长
    const getDisplayDuration = () => {
      switch (notification.type) {
        case 'error': return 8000; // 错误通知显示更久
        case 'warning': return 6000;
        case 'success': return 4000;
        default: return 5000;
      }
    };

    // 自动消失
    dismissTimerRef.current = setTimeout(() => {
      handleDismiss();
    }, getDisplayDuration());

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
    };
  }, [notification.type]);

  const handleDismiss = () => {
    // 防止重复触发
    if (isDismissedRef.current) return;
    isDismissedRef.current = true;

    // 清除自动消失定时器
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }

    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      default: return '#2196F3';
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Pressable style={styles.content} onPress={handleDismiss}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    borderRadius: 8,
    padding: 15,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    color: 'white',
    fontSize: 14,
  },
});

NotificationBanner.displayName = 'NotificationBanner';

export default NotificationBanner;