import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const STORAGE_KEY = "Times";

export interface TimeItem {
  id: string;
  title: string;
  time: string;
  isEnabled: boolean;
  repeatType: 'once' | 'daily' | 'workdays' | 'custom';
  selectedDays?: string[];
  soundEnabled: boolean;
  createdAt: Date;
  notificationId?: string;
}

let timeItems: TimeItem[] = [];

export class timeManager {
  static async initialize() {
    try {
      const storedItems = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        timeItems = JSON.parse(storedItems);
      }
    } catch (error) {
      console.error("加载数据失败:", error);
    }
  }
  static async addTimeItem(item: TimeItem) {
    timeItems.push(item);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timeItems));
  }
  static async getTimeItems() {
    return timeItems;
  }
  static async updateTimeItem(item: TimeItem) {
    const index = timeItems.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      timeItems[index] = item;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timeItems));
    }
  }
  static async deleteTimeItem(id: string) {
    timeItems = timeItems.filter((item) => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timeItems));
  }
  static async clearTimeItems() {
    timeItems = [];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timeItems));
  }

  // 切换定时项的启用状态
  static async toggleTimeItem(id: string) {
    const index = timeItems.findIndex((i) => i.id === id);
    if (index !== -1) {
      timeItems[index].isEnabled = !timeItems[index].isEnabled;
      
      if (timeItems[index].isEnabled) {
        await this.scheduleNotification(timeItems[index]);
      } else {
        await this.cancelNotification(timeItems[index]);
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timeItems));
    }
  }

  // 调度通知
  static async scheduleNotification(item: TimeItem) {
    try {
      console.log(`开始调度通知: ${item.title}, 时间: ${item.time}, 类型: ${item.repeatType}`);
      
      // Web平台不支持通知，直接返回
      if (Platform.OS === 'web') {
        console.log('Web平台跳过通知调度');
        return;
      }
      
      // 取消之前的通知
      if (item.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(item.notificationId);
        console.log(`已取消之前的通知: ${item.notificationId}`);
      }

      const [hours, minutes] = item.time.split(':').map(Number);
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      console.log(`当前时间: ${now.toLocaleString()}, 计划时间: ${scheduledTime.toLocaleString()}`);

      // 如果时间已过，设置为明天
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
        console.log(`时间已过，调整为明天: ${scheduledTime.toLocaleString()}`);
      }

      let trigger: any;
      
      switch (item.repeatType) {
        case 'once':
          // 对于一次性通知，直接使用日期对象
          trigger = scheduledTime;
          break;
        case 'daily':
          trigger = {
            hour: hours,
            minute: minutes,
            repeats: true,
          };
          break;
        case 'workdays':
          // 工作日 (周一到周五)
          trigger = {
            hour: hours,
            minute: minutes,
            weekday: [2, 3, 4, 5, 6], // 1=Sunday, 2=Monday, ..., 7=Saturday
            repeats: true,
          };
          break;
        case 'custom':
          if (item.selectedDays && item.selectedDays.length > 0) {
            // 自定义天数
            const weekdays = item.selectedDays.map(day => {
              const dayMap: { [key: string]: number } = {
                '周日': 1, '周一': 2, '周二': 3, '周三': 4,
                '周四': 5, '周五': 6, '周六': 7
              };
              return dayMap[day];
            }).filter(Boolean);
            
            trigger = {
              hour: hours,
              minute: minutes,
              weekday: weekdays,
              repeats: true,
            };
          }
          break;
      }

      console.log('通知触发器配置:', JSON.stringify(trigger, null, 2));

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '定时提醒',
          body: item.title,
          sound: item.soundEnabled,
        },
        trigger,
      });

      console.log(`通知调度成功，ID: ${notificationId}`);

      // 更新通知ID
      const index = timeItems.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        timeItems[index].notificationId = notificationId;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timeItems));
        console.log(`已更新通知ID到存储`);
      }

    } catch (error) {
      console.error('调度通知失败:', error);
    }
  }

  // 取消通知
  static async cancelNotification(item: TimeItem) {
    if (item.notificationId && Platform.OS !== 'web') {
      try {
        await Notifications.cancelScheduledNotificationAsync(item.notificationId);
        
        // 清除通知ID
        const index = timeItems.findIndex((i) => i.id === item.id);
        if (index !== -1) {
          timeItems[index].notificationId = undefined;
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timeItems));
        }
      } catch (error) {
        console.error('取消通知失败:', error);
      }
    }
  }

  // 获取启用的定时项
  static async getEnabledTimeItems() {
    return timeItems.filter(item => item.isEnabled);
  }

  // 重新调度所有启用的通知
  static async rescheduleAllNotifications() {
    const enabledItems = await this.getEnabledTimeItems();
    for (const item of enabledItems) {
      await this.scheduleNotification(item);
    }
  }
}

