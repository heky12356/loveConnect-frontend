import { useState, useEffect, useCallback } from 'react';
import { timeManager, TimeItem } from '../api/timeManager';

export const useTimeManager = () => {
  const [items, setItems] = useState<TimeItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 初始化和加载数据
  useEffect(() => {
    const initializeData = async () => {
      try {
        await timeManager.initialize();
        const timeItems = await timeManager.getTimeItems();
        setItems(timeItems);
      } catch (error) {
        console.error('初始化定时数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // 刷新数据
  const refreshItems = useCallback(async () => {
    try {
      const timeItems = await timeManager.getTimeItems();
      setItems(timeItems);
    } catch (error) {
      console.error('刷新数据失败:', error);
    }
  }, []);

  // 添加定时项
  const addItem = useCallback(async (itemData: Omit<TimeItem, 'id' | 'createdAt'>) => {
    try {
      const newItem: TimeItem = {
        ...itemData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
      };
      
      await timeManager.addTimeItem(newItem);
      
      // 如果启用状态，立即调度通知
      if (newItem.isEnabled) {
        await timeManager.scheduleNotification(newItem);
      }
      
      await refreshItems();
      return newItem;
    } catch (error) {
      console.error('添加定时项失败:', error);
      throw error;
    }
  }, [refreshItems]);

  // 删除定时项
  const deleteItem = useCallback(async (id: string) => {
    try {
      // 先取消通知
      const item = items.find(item => item.id === id);
      if (item) {
        await timeManager.cancelNotification(item);
      }
      
      await timeManager.deleteTimeItem(id);
      await refreshItems();
    } catch (error) {
      console.error('删除定时项失败:', error);
      throw error;
    }
  }, [items, refreshItems]);

  // 更新定时项
  const updateItem = useCallback(async (updatedItem: TimeItem) => {
    try {
      await timeManager.updateTimeItem(updatedItem);
      
      // 重新调度通知
      if (updatedItem.isEnabled) {
        await timeManager.scheduleNotification(updatedItem);
      } else {
        await timeManager.cancelNotification(updatedItem);
      }
      
      await refreshItems();
    } catch (error) {
      console.error('更新定时项失败:', error);
      throw error;
    }
  }, [refreshItems]);

  // 切换启用状态
  const toggleItem = useCallback(async (id: string) => {
    try {
     // 先乐观更新UI状态
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, isEnabled: !item.isEnabled } : item
        )
      );
      
      // 然后更新后端数据
      await timeManager.toggleTimeItem(id);
      
      // 最后刷新确保数据一致性
      await refreshItems();
    } catch (error) {
      console.error('切换定时项状态失败:', error);
      // 如果出错，重新刷新数据恢复正确状态
      await refreshItems();
      throw error;
    }
  }, [refreshItems]);

  // 清空所有定时项
  const clearAllItems = useCallback(async () => {
    try {
      // 先取消所有通知
      for (const item of items) {
        await timeManager.cancelNotification(item);
      }
      
      await timeManager.clearTimeItems();
      await refreshItems();
    } catch (error) {
      console.error('清空定时项失败:', error);
      throw error;
    }
  }, [items, refreshItems]);

  // 获取启用的定时项
  const getEnabledItems = useCallback(async () => {
    try {
      return await timeManager.getEnabledTimeItems();
    } catch (error) {
      console.error('获取启用的定时项失败:', error);
      return [];
    }
  }, []);

  return {
    items,
    loading,
    addItem,
    deleteItem,
    updateItem,
    toggleItem,
    clearAllItems,
    refreshItems,
    getEnabledItems,
  } as const;
};