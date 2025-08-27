import { NotificationData } from '@/types/websocket';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text } from 'react-native';

const { width } = Dimensions.get('window');

interface NotificationBannerProps {
  notification: NotificationData;
  onDismiss: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ notification, onDismiss }) => {
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    // 滑入动画
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // 自动消失
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
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
};

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

export default NotificationBanner;