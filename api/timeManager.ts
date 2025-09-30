import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { UserIsolatedStorage } from '../utils/storageUtils';
import { log } from './config';

const STORAGE_KEY = "Times";
const BASE_STORAGE_KEY = "Times";

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
      // 尝试从新的用户隔离存储中获取数据
      const storedItems = await UserIsolatedStorage.getItem(BASE_STORAGE_KEY);
      if (storedItems) {
        timeItems = JSON.parse(storedItems);
      }
    } catch (error) {
      console.error("加载数据失败:", error);
    }
  }
  static async addTimeItem(item: TimeItem) {
    timeItems.push(item);
    await UserIsolatedStorage.setItem(BASE_STORAGE_KEY, JSON.stringify(timeItems));
  }
  static async getTimeItems() {
    return timeItems;
  }
  static async updateTimeItem(item: TimeItem) {
    const index = timeItems.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      timeItems[index] = item;
      await UserIsolatedStorage.setItem(BASE_STORAGE_KEY, JSON.stringify(timeItems));
    }
  }
  static async deleteTimeItem(id: string) {
    timeItems = timeItems.filter((item) => item.id !== id);
    await UserIsolatedStorage.setItem(BASE_STORAGE_KEY, JSON.stringify(timeItems));
  }
  static async clearTimeItems() {
    timeItems = [];
    await UserIsolatedStorage.setItem(BASE_STORAGE_KEY, JSON.stringify(timeItems));
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
        log.debug('Web平台跳过通知调度');
        return;
      }
      
      // 取消之前的通知
      if (item.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(item.notificationId);
        log.debug(`已取消之前的通知: ${item.notificationId}`);
      }

      const [hours, minutes] = item.time.split(':').map(Number);
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      log.debug(`当前时间: ${now.toLocaleString()}, 计划时间: ${scheduledTime.toLocaleString()}`);

      // 如果时间已过，设置为明天
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
        log.debug(`时间已过，调整为明天: ${scheduledTime.toLocaleString()}`);
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

  // 修改定时问候时间
  static async updateGreetingCron(timeString: string): Promise<{ success: boolean; message: string }> {
    try {
      // 将时间字符串转换为Cron表达式
      // 时间格式从 "HH:mm" 转换为 "0 mm HH * * ?"
      const [hours, minutes] = timeString.split(':').map(Number);
      const greetingCron = `0 ${minutes} ${hours} * * ?`;

      console.log(`转换时间格式: ${timeString} -> ${greetingCron}`);

      // 动态导入配置和认证API工具
      const { config } = await import('./config');
      const { authenticatedApiRequest } = await import('./apiUtils');

      // 获取认证token
      const { getAuthManager } = await import('./authManager');
      const authManager = getAuthManager();
      const token = await authManager.getToken();

      if (!token) {
        return {
          success: false,
          message: '用户未登录，请先登录'
        };
      }

      // 构建完整的API URL
      const apiUrl = `${config.api.baseUrl}/user/config/greeting-cron`;
      console.log('API URL:', apiUrl);
      console.log('请求数据:', { greetingCron });

      const response = await authenticatedApiRequest(apiUrl, token, {
        method: 'POST',
        body: JSON.stringify({ greetingCron })
      });

      console.log('API响应:', response);

      return {
        success: true,
        message: '定时问候时间已更新'
      };

    } catch (error) {
      log.error('更新定时问候时间失败:', error);

      // 增强错误处理
      if (error instanceof Error) {
        if (error.message.includes('JSON Parse error')) {
          return {
            success: false,
            message: '服务器返回格式错误，请检查接口地址是否正确'
          };
        } else if (error.message.includes('Network request failed')) {
          return {
            success: false,
            message: '网络连接失败，请检查网络连接'
          };
        } else if (error.message.includes('未授权')) {
          return {
            success: false,
            message: '用户认证失败，请重新登录'
          };
        }
      }

      return {
        success: false,
        message: '网络错误，请稍后重试'
      };
    }
  }
}

