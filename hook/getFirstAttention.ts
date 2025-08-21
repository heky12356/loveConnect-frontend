import { useEffect, useState } from "react";

let globalState = true; // 模块级别的状态，只初始化一次
let listeners: ((value: boolean) => void)[] = [];

export const useFirstAttention = () => {
  const [isFirstAttention, setisFirstAttention] = useState(globalState);
  
  useEffect(() => {
    // 订阅全局状态变化
    const listener = (newValue: boolean) => {
      setisFirstAttention(newValue);
    };
    listeners.push(listener);
    
    return () => {
      // 清理订阅
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);
  
  const updateIsFirstAttention = (newValue: boolean) => {
    globalState = newValue;
    // 通知所有订阅者
    listeners.forEach(listener => listener(newValue));
  };
  
  return [isFirstAttention, updateIsFirstAttention] as const;
};