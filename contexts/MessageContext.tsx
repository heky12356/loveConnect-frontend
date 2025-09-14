import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWebSocket } from '@/hook/useWebSocket';
import { getAiManager } from '@/api/aiManeger';
import { useImg } from '@/hook/useImg';

interface AiItem {
  id: string;
  name: string;
  img: string;
  postNum: number;
  hasNewMessage: boolean;
}

interface MessageContextType {
  aiItems: AiItem[];
  totalUnreadCount: number;
  updateAiItemStatus: (aiName: string, hasNewMessage: boolean, postNum: number) => void;
  clearAiItemMessages: (aiName: string) => void;
  loading: boolean;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const { notifications } = useWebSocket();
  const [aiItems, setAiItems] = useState<AiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const exampleImg = useImg().getImg("001");

  // 计算总的未读消息数量
  const totalUnreadCount = aiItems.reduce((total, item) => total + item.postNum, 0);

  // 加载AI列表
  useEffect(() => {
    const loadAiList = async () => {
      try {
        setLoading(true);
        console.log('MessageContext: 开始获取AI列表...');
        const aiList = await getAiManager().getAiList();
        console.log('MessageContext: 获取到的AI数据:', aiList);
        
        // 转换为页面需要的格式
        const formattedAiItems = aiList.map(ai => ({
          id: ai.id,
          name: ai.name,
          img: ai.img || exampleImg,
          postNum: 0,
          hasNewMessage: false
        }));
        
        setAiItems(formattedAiItems);
        console.log('MessageContext: 设置AI项目:', formattedAiItems);
      } catch (error) {
        console.error('MessageContext: 获取AI列表失败:', error);
        // 如果获取失败，使用默认数据
        setAiItems([
          { id: '1', name: '女儿', img: exampleImg, postNum: 0, hasNewMessage: false },
          { id: '2', name: '儿子', img: exampleImg, postNum: 0, hasNewMessage: false },
          { id: '3', name: '妻子', img: exampleImg, postNum: 0, hasNewMessage: false },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    loadAiList();
  }, []);

  // 处理WebSocket通知
  useEffect(() => {
    console.log('MessageContext: 收到通知:', notifications);
    // 当收到WebSocket消息时，更新对应的AI项状态
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      console.log('MessageContext: 最新通知:', latestNotification);
      
      // 从AI响应格式中获取aiRoleId
      let aiName = null;
      if (latestNotification.data && latestNotification.data.aiRoleId) {
        aiName = latestNotification.data.aiRoleId;
      } else if (latestNotification.aiName) {
        aiName = latestNotification.aiName;
      }
      
      console.log('MessageContext: 提取的AI名称:', aiName);
      
      if (aiName) {
        setAiItems(prev => {
          const updated = prev.map(item => 
            item.name === aiName 
              ? { ...item, hasNewMessage: true, postNum: (item.postNum || 0) + 1 }
              : item
          );
          console.log('MessageContext: 更新后的AI项目:', updated);
          return updated;
        });
      }
    }
  }, [notifications]);

  const updateAiItemStatus = (aiName: string, hasNewMessage: boolean, postNum: number) => {
    setAiItems(prev => 
      prev.map(item => 
        item.name === aiName 
          ? { ...item, hasNewMessage, postNum }
          : item
      )
    );
  };

  const clearAiItemMessages = (aiName: string) => {
    setAiItems(prev => 
      prev.map(item => 
        item.name === aiName 
          ? { ...item, hasNewMessage: false, postNum: 0 }
          : item
      )
    );
  };

  const value: MessageContextType = {
    aiItems,
    totalUnreadCount,
    updateAiItemStatus,
    clearAiItemMessages,
    loading
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};