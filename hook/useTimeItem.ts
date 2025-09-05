/** 
 *  旧的时间项hook目前已经弃用
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { UserIsolatedStorage } from '../utils/storageUtils';

const STORAGE_KEY = "timeItems";
const BASE_STORAGE_KEY = "timeItems";

interface Item {
  title: string;
  time: string;
}

let globalState: Item[] = [];

const loadItems = async () => {
  try {
    // 尝试从新的用户隔离存储中获取数据
    const storedItems = await UserIsolatedStorage.getItem(BASE_STORAGE_KEY);
    if (storedItems) {
      globalState = JSON.parse(storedItems);
    }
  } catch (error) {
    console.error("加载数据失败:", error);
  }
};

// 保存数据到本地存储
const saveItems = async (newItems: Item[]) => {
  try {
    await UserIsolatedStorage.setItem(BASE_STORAGE_KEY, JSON.stringify(newItems));
  } catch (error) {
    console.error("保存数据失败:", error);
  }
};

loadItems();

export const useTimeItem = () => {
  const [items, setItems] = useState<Item[]>(globalState);
  const addItem = (item: Item) => {
    setItems((prev) => [...prev, item]);
    globalState = [...globalState, item];
    saveItems(globalState);
  };
  const deleteItem = (index: number) => {
    setItems((prev) => prev.filter((item, i) => i !== index));
    globalState = globalState.filter((item, i) => i !== index);
    saveItems(globalState);
  };
  return {
    items,
    addItem,
    deleteItem,
  } as const;
};
