import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthManager } from '../api/authManager';

/**
 * 获取当前用户的手机号
 * @returns 当前用户的手机号，如果未登录则返回 'guest'
 */
export const getCurrentUserPhone = async (): Promise<string> => {
  try {
    const authManager = getAuthManager();
    const user = await authManager.getCurrentUser();
    return user?.phone || 'guest';
  } catch (error) {
    console.warn('获取用户手机号失败，使用默认值:', error);
    return 'guest';
  }
};

/**
 * 生成带用户手机号前缀的存储key
 * @param baseKey 基础key
 * @param phone 用户手机号（可选，如果不提供会自动获取）
 * @returns 带用户前缀的完整key
 */
export const generateUserStorageKey = async (baseKey: string, phone?: string): Promise<string> => {
  const userPhone = phone || await getCurrentUserPhone();
  return `${userPhone}:${baseKey}`;
};

/**
 * 带用户隔离的AsyncStorage操作封装
 */
export class UserIsolatedStorage {
  /**
   * 获取带用户前缀的存储项
   * @param baseKey 基础key
   * @param phone 用户手机号（可选）
   * @returns 存储的值
   */
  static async getItem(baseKey: string, phone?: string): Promise<string | null> {
    const key = await generateUserStorageKey(baseKey, phone);
    return AsyncStorage.getItem(key);
  }

  /**
   * 设置带用户前缀的存储项
   * @param baseKey 基础key
   * @param value 要存储的值
   * @param phone 用户手机号（可选）
   */
  static async setItem(baseKey: string, value: string, phone?: string): Promise<void> {
    const key = await generateUserStorageKey(baseKey, phone);
    return AsyncStorage.setItem(key, value);
  }

  /**
   * 删除带用户前缀的存储项
   * @param baseKey 基础key
   * @param phone 用户手机号（可选）
   */
  static async removeItem(baseKey: string, phone?: string): Promise<void> {
    const key = await generateUserStorageKey(baseKey, phone);
    return AsyncStorage.removeItem(key);
  }

  /**
   * 清除指定用户的所有数据
   * @param phone 用户手机号
   */
  static async clearUserData(phone: string): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const userKeys = allKeys.filter(key => key.startsWith(`${phone}:`));
      if (userKeys.length > 0) {
        await AsyncStorage.multiRemove(userKeys);
      }
    } catch (error) {
      console.error('清除用户数据失败:', error);
    }
  }

  /**
   * 获取指定用户的所有存储key
   * @param phone 用户手机号
   * @returns 该用户的所有存储key数组
   */
  static async getUserKeys(phone: string): Promise<string[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys.filter(key => key.startsWith(`${phone}:`));
    } catch (error) {
      console.error('获取用户存储key失败:', error);
      return [];
    }
  }
}

/**
 * 迁移旧的存储数据到新的用户隔离格式
 * @param oldKey 旧的存储key
 * @param newBaseKey 新的基础key
 * @param phone 用户手机号
 */
export const migrateStorageData = async (oldKey: string, newBaseKey: string, phone: string): Promise<void> => {
  try {
    const oldData = await AsyncStorage.getItem(oldKey);
    if (oldData) {
      await UserIsolatedStorage.setItem(newBaseKey, oldData, phone);
      await AsyncStorage.removeItem(oldKey);
      console.log(`已迁移存储数据: ${oldKey} -> ${phone}:${newBaseKey}`);
    }
  } catch (error) {
    console.error('迁移存储数据失败:', error);
  }
};