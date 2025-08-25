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
export class msgManager {
  private static chatMap: ChatMap = new Map();
  /**
   * 获取指定用户的消息列表
   * @param name 用户名
   * @returns 消息数组
   */
  static getMessages(name: string): Message[] {
    return this.chatMap.get(name) || [];
  }

  /**
   * 添加新消息到本地存储
   * @param name 用户名
   * @param message 消息对象
   */
  static addMessage(name: string, message: Message): void {
    const messages = this.getMessages(name);
    const newMessages = [...messages, message]; // 创建新数组引用
    this.chatMap.set(name, newMessages);
  }

  /**
   * 清空指定用户的消息
   * @param name 用户名
   */
  static clearMessages(name: string): void {
    this.chatMap.delete(name);
  }

  /**
   * 发送消息到WebSocket (预留接口)
   * @param name 用户名
   * @param message 消息对象
   */
  static sendToWebSocket(name: string, message: Message): void {
    // TODO: 实现WebSocket发送逻辑
    console.log("发送消息到WebSocket:", { name, message });
  }

  /**
   * 创建新的语音消息
   * @param uri 语音文件URI
   * @param sender 发送方
   * @returns 消息对象
   */
  // 这边等后端语音转文字的api做完了得修改下逻辑
  static createMessage(uri: string, sender: "me" | "other"): Message {
    return {
      uri,
      text: "暂时无法转换为文字",
      time: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender,
    };
  }
}
