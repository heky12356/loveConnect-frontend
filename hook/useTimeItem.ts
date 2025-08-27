/** 
 *  旧的时间项hook目前已经弃用
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

const STORAGE_KEY = "timeItems";

interface Item {
  title: string;
  time: string;
}

let globalState: Item[] = [];

const loadItems = async () => {
  try {
    const storedItems = await AsyncStorage.getItem(STORAGE_KEY);
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
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
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
