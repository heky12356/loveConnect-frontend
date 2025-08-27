import { WebSocketProvider } from '@/hook/useWebSocket';
import { Stack } from "expo-router";
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { timeManager } from '@/api/timeManager';

// 设置通知处理器（仅在移动端）
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export default function RootLayout() {
  useEffect(() => {
    // 初始化通知系统
    const initializeNotifications = async () => {
      // 只在移动端初始化通知系统
      if (Platform.OS === 'web') {
        console.log('Web平台跳过通知系统初始化');
        // 仍然初始化timeManager以支持数据管理
        try {
          await timeManager.initialize();
          console.log('timeManager初始化完成（Web平台）');
        } catch (error) {
          console.error('timeManager初始化失败:', error);
        }
        return;
      }

      // 请求通知权限
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.warn('通知权限未授予');
        return;
      }
      
      console.log('通知权限已授予');
      
      // 初始化timeManager并重新调度所有通知
      try {
        await timeManager.initialize();
        await timeManager.rescheduleAllNotifications();
        console.log('通知系统初始化完成');
      } catch (error) {
        console.error('通知系统初始化失败:', error);
      }
    };

    initializeNotifications();
  }, []);

  return (
    <WebSocketProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </WebSocketProvider>
  );
}
