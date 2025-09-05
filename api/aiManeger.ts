// const mod = "development";
const mod = "production";

// AI项目接口
interface AiItem {
  id: string;
  name: string;
  img: string;
  voice?: string;
  createdAt?: string;
  profileId?: number;
  relation?: string;
  voiceId?: string;
}

// 音频上传响应接口
interface VoiceInitResponse {
  simulatedAudioUrl: string;
  voiceId: string;
  originalAudioPath: string;
}

// AI配置保存请求接口
interface VoiceSaveRequest {
  userId: number;
  voiceId: string;
  relation?: string;
  originalAudioPath: string;
  simulatedAudioPath: string;
}

// AI配置保存响应接口
interface VoiceSaveResponse {
  profileId: number;
}

// 聊天记录接口
interface ChatRecord {
  id: number;
  userVoiceUrl: string;
  userText: string;
  aiVoiceUrl: string;
  aiText: string;
  chatTime: string;
}

// 聊天记录列表响应接口
interface ChatRecordsResponse {
  total: number;
  list: ChatRecord[];
  pageNum: number;
  pageSize: number;
  pages: number;
}

import { ApiResponse, handleApiError, handleApiResponse } from './apiUtils';
import { getAuthManager } from './authManager';

let localAiList: AiItem[] = [
  {
    id: "001",
    name: "女儿",
    img: "https://pan.heky.top/tmp/profile.png",
    voice: "温柔女声",
    createdAt: new Date().toISOString(),
    profileId: 1001,
    relation: "女儿",
    voiceId: "model_001",
  },
];

// AI管理器接口
interface AiManager {
  // AI项目管理
  getAiList: () => Promise<AiItem[]>;
  
  // AI声音初始化
  uploadVoiceInit: (base64Audio: string, relation?: string, voiceId?: string) => Promise<VoiceInitResponse>;
  saveVoiceConfig: (config: VoiceSaveRequest) => Promise<VoiceSaveResponse>;
  
  // 聊天记录管理
  getChatRecords: (profileId: number, pageNum?: number, pageSize?: number) => Promise<ChatRecordsResponse>;
}

// 生产环境的AI管理类实现
class AiManagerImpl implements AiManager {
  private baseURL = 'http://192.168.1.6:8080'; // 根据实际后端地址配置
  
  async getAiList(): Promise<AiItem[]> {
    try {
      // 获取认证token
      const authManager = getAuthManager();
      const token = await authManager.getToken();
      
      console.log('Token状态:', token ? '已获取' : '未获取');

      console.log('发送API请求到:', `${this.baseURL}/ai/getallai`);
      const response = await fetch(`${this.baseURL}/ai/getallai`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      
      console.log('API响应状态:', response.status, response.statusText);
      
      const result = await response.json();
      
      console.log("bug", result);
      
      // 处理后端返回的code可能是字符串的情况
      if (typeof result.code === 'string') {
        result.code = parseInt(result.code, 10);
      }
      
      const data = handleApiResponse(result as ApiResponse<any[]>);
      console.log('处理后的数据:', data);
      console.log('数据类型:', typeof data, '是否为数组:', Array.isArray(data));
      
      if (!Array.isArray(data)) {
        console.warn('API返回的数据不是数组格式:', data);
        return [];
      }
      
      // 转换后端数据格式为前端格式
      // 根据接口文档，后端只返回 relation 和 voiceId 字段
      const aiList: AiItem[] = data.map((item: any, index: number) => {
        console.log(`转换第${index + 1}个AI项目:`, item);
        return {
          id: item.voiceId || `ai_${index + 1}`, // 使用voiceId作为id，或生成默认id
          name: item.relation || '未命名AI', // 使用relation作为显示名称
          img: 'https://pan.heky.top/tmp/profile.png', // 使用默认头像
          voice: item.voiceId || '',
          createdAt: new Date().toISOString(),
          profileId: index + 1000, // 生成临时profileId
          relation: item.relation || '',
          voiceId: item.voiceId || '',
        };
      });
      
      console.log('最终转换的AI列表:', aiList);
      console.log('AI列表长度:', aiList.length);
      return aiList;
    } catch (error) {
      // 对于404错误（用户不存在关联的AI信息），这是正常情况，不输出error日志
      if (error instanceof Error && (error as any).code === 404) {
        console.log('用户暂无关联的AI信息，返回空列表');
        return [];
      }
      // 不重新抛出错误，直接返回空数组让前端继续工作
      return [];
    }
  }
  

  
  async uploadVoiceInit(base64Audio: string, relation?: string, voiceId?: string): Promise<VoiceInitResponse> {
    try {
      // 获取认证token
      const authManager = getAuthManager();
      const token = await authManager.getToken();
      
      if (!token) {
        throw new Error('用户未登录');
      }

      const requestBody = {
        base64Audio,
        relation,
        voiceId
      };
      
      // 直接使用fetch而不是authenticatedApiRequest，避免重复JSON解析
      const response = await fetch(`${this.baseURL}/ai/voice/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      const result: ApiResponse<VoiceInitResponse> = await response.json();
      return handleApiResponse(result);
    } catch (error) {
      handleApiError(error);
    }
  }
  
  async saveVoiceConfig(config: VoiceSaveRequest): Promise<VoiceSaveResponse> {
    try {
      // 获取认证token
      const authManager = getAuthManager();
      const token = await authManager.getToken();
      
      if (!token) {
        throw new Error('用户未登录');
      }

      const response = await fetch(`${this.baseURL}/ai/savevoiceconfig`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });
      
      const result: ApiResponse<VoiceSaveResponse> = await response.json();
      return handleApiResponse(result);
    } catch (error) {
      handleApiError(error);
    }
  }
  
  async getChatRecords(profileId: number, pageNum: number = 1, pageSize: number = 20): Promise<ChatRecordsResponse> {
    try {
      // 获取认证token
      const authManager = getAuthManager();
      const token = await authManager.getToken();
      
      if (!token) {
        throw new Error('用户未登录');
      }

      const params = new URLSearchParams({
        profileId: profileId.toString(),
        pageNum: pageNum.toString(),
        pageSize: pageSize.toString(),
      });
      
      const response = await fetch(`${this.baseURL}/ai/chat/records?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result: ApiResponse<ChatRecordsResponse> = await response.json();
      return handleApiResponse(result);
    } catch (error) {
      handleApiError(error);
    }
  }
}

// 开发环境的AI管理类实现（Mock）
class AiManagerMock implements AiManager {
  private static instance: AiManagerMock;
  private mockChatRecords: ChatRecord[] = [
    {
      id: 5001,
      userVoiceUrl: "http://domain/path/to/user_voice1.wav",
      userText: "你好，今天天气怎么样？",
      aiVoiceUrl: "http://domain/path/to/ai_voice1.wav",
      aiText: "今天天气很好，阳光明媚，适合出门走走。",
      chatTime: "2023-10-15 14:30:25"
    },
    {
      id: 5002,
      userVoiceUrl: "http://domain/path/to/user_voice2.wav",
      userText: "我想你了",
      aiVoiceUrl: "http://domain/path/to/ai_voice2.wav",
      aiText: "我也想你，要好好照顾自己哦。",
      chatTime: "2023-10-15 15:20:10"
    }
  ];
  
  // 单例模式
  public static getInstance(): AiManagerMock {
    if (!AiManagerMock.instance) {
      AiManagerMock.instance = new AiManagerMock();
    }
    return AiManagerMock.instance;
  }
  
  private constructor() {}
  
  async getAiList(): Promise<AiItem[]> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...localAiList];
  }
  
  async uploadVoiceInit(base64Audio: string, relation?: string, voiceId?: string): Promise<VoiceInitResponse> {
    // 模拟音频上传和AI处理延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('上传音频base64:', base64Audio.substring(0, 50) + '...', '关系:', relation, '音色ID:', voiceId);
    
    // 模拟返回数据
    return {
      simulatedAudioUrl: `http://domain/path/to/simulated_${Date.now()}.wav`,
      voiceId: voiceId || `model_${Math.floor(Math.random() * 1000) + 1}`,
      originalAudioPath: `/path/to/original_${Date.now()}.wav`,
    };
  }
  
  async saveVoiceConfig(config: VoiceSaveRequest): Promise<VoiceSaveResponse> {
    // 模拟保存配置延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('保存AI声音配置:', config);
    
    const profileId = Math.floor(Math.random() * 9000) + 1000;
    return { profileId };
  }
  
  async getChatRecords(profileId: number, pageNum: number = 1, pageSize: number = 20): Promise<ChatRecordsResponse> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`获取聊天记录 - profileId: ${profileId}, pageNum: ${pageNum}, pageSize: ${pageSize}`);
    
    // 模拟分页数据
    const total = this.mockChatRecords.length;
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const list = this.mockChatRecords.slice(startIndex, endIndex);
    const pages = Math.ceil(total / pageSize);
    
    return {
      total,
      list,
      pageNum,
      pageSize,
      pages,
    };
  }
}

// 单例实例
let aiManagerInstance: AiManager | null = null;

// 导出AI管理器实例
export const getAiManager = (): AiManager => {
  if (!aiManagerInstance) {
    const isDevelopment = mod === 'development';
    
    if (isDevelopment) {
      aiManagerInstance = AiManagerMock.getInstance();
    } else {
      aiManagerInstance = new AiManagerImpl();
    }
  }
  
  return aiManagerInstance;
};

export type {
  AiItem,
  AiManager, ChatRecord,
  ChatRecordsResponse, VoiceInitResponse,
  VoiceSaveRequest,
  VoiceSaveResponse
};

