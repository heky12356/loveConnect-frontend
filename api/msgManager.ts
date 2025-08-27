import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "ChatMap";

// 消息结构体定义
export interface Message {
  uri?: string; // 语音文件URI
  text?: string; // 文本内容
  time: string; // 发送时间
  sender: "me" | "other"; // 发送方
}

// 聊天数据存储类型
type ChatMap = Map<string, Message[]>;

/**
 * 消息管理器
 * 负责管理本地消息存储、获取和WebSocket通信
 */
class MsgManager {
  private static instance: MsgManager | null = null;
  private chatMap: ChatMap = new Map();
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): MsgManager {
    if (!MsgManager.instance) {
      MsgManager.instance = new MsgManager();
    }
    return MsgManager.instance;
  }

  // 初始化数据加载
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      const storedItems = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        this.chatMap = new Map(Object.entries(JSON.parse(storedItems)));
      }
      this.initialized = true;
    } catch (error) {
      console.error("加载数据失败:", error);
    }
  }
  /**
   * 获取指定用户的消息列表
   * @param name 用户名
   * @returns 消息数组
   */
  getMessages(name: string): Message[] {
    return this.chatMap.get(name) || [];
  }

  /**
   * 添加新消息到本地存储
   * @param name 用户名
   * @param message 消息对象
   * @returns 更新后的消息列表
   */
  async addMessage(name: string, message: Message): Promise<Message[]> {
    const messages = this.getMessages(name);
    const newMessages = [...messages, message]; // 创建新数组引用
    this.chatMap.set(name, newMessages);
    
    // 持久化到AsyncStorage
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(this.chatMap)));
    } catch (error) {
      console.error("保存数据失败:", error);
    }
    
    return newMessages; // 返回更新后的消息列表
  }

  /**
   * 清空指定用户的消息
   * @param name 用户名
   */
  async clearMessages(name: string): Promise<void> {
    this.chatMap.delete(name);
    
    // 持久化到AsyncStorage
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(this.chatMap)));
    } catch (error) {
      console.error("保存数据失败:", error);
    }
  }

  /**
   * 发送消息到WebSocket (预留接口)
   * @param name 用户名
   * @param message 消息对象
   */
  sendToWebSocket(name: string, message: Message): void {
    // TODO: 实现WebSocket发送逻辑
    console.log("发送消息到WebSocket:", { name, message });
  }

  /**
   * 创建新消息
   * @param uri 语音文件URI（可选）
   * @param sender 发送方
   * @param text 文本内容（可选，如果不提供则使用默认文本）
   * @returns 消息对象
   */
  createMessage(uri: string | undefined, sender: "me" | "other", text?: string): Message {
    return {
      uri,
      text: text || "暂时无法转换为文字",
      time: new Date().toLocaleTimeString("zh-CN", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender,
    };
  }
}

// 导出单例实例
export const msgManager = MsgManager.getInstance();
