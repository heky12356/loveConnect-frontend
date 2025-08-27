const mod = "development";
// const mod = "production";

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

// 统一响应格式
interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

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
  addAiItem: (item: AiItem) => Promise<void>;
  createAiItem: (item: AiItem) => Promise<AiItem>;
  
  // AI声音初始化
  uploadVoiceInit: (audioFile: File, relation?: string, voiceId?: string) => Promise<VoiceInitResponse>;
  saveVoiceConfig: (config: VoiceSaveRequest) => Promise<VoiceSaveResponse>;
  
  // 聊天记录管理
  getChatRecords: (profileId: number, pageNum?: number, pageSize?: number) => Promise<ChatRecordsResponse>;
}

// 生产环境的AI管理类实现
class AiManagerImpl implements AiManager {
  private baseURL = 'http://localhost:8080'; // 根据实际后端地址配置
  
  async getAiList(): Promise<AiItem[]> {
    // 实际实现中应该从后端API获取
    const response = await fetch(`${this.baseURL}/ai/list`);
    const result: ApiResponse<AiItem[]> = await response.json();
    
    if (result.code !== '200') {
      throw new Error(result.message || '获取AI列表失败');
    }
    
    return result.data;
  }
  
  async addAiItem(item: AiItem): Promise<void> {
    const response = await fetch(`${this.baseURL}/ai/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    
    const result: ApiResponse<void> = await response.json();
    
    if (result.code !== '200') {
      throw new Error(result.message || '添加AI项目失败');
    }
  }
  
  async createAiItem(item: AiItem): Promise<AiItem> {
    const response = await fetch(`${this.baseURL}/ai/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    
    const result: ApiResponse<AiItem> = await response.json();
    
    if (result.code !== '200') {
      throw new Error(result.message || '创建AI项目失败');
    }
    
    return result.data;
  }
  
  async uploadVoiceInit(audioFile: File, relation?: string, voiceId?: string): Promise<VoiceInitResponse> {
    const formData = new FormData();
    formData.append('file', audioFile);
    if (relation) formData.append('relation', relation);
    if (voiceId) formData.append('voiceId', voiceId);
    
    const response = await fetch(`${this.baseURL}/ai/voice/init`, {
      method: 'POST',
      body: formData,
    });
    
    const result: ApiResponse<VoiceInitResponse> = await response.json();
    
    if (result.code !== '200') {
      throw new Error(result.message || '音频上传失败');
    }
    
    return result.data;
  }
  
  async saveVoiceConfig(config: VoiceSaveRequest): Promise<VoiceSaveResponse> {
    const response = await fetch(`${this.baseURL}/ai/voice/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    
    const result: ApiResponse<VoiceSaveResponse> = await response.json();
    
    if (result.code !== '200') {
      throw new Error(result.message || '保存AI配置失败');
    }
    
    return result.data;
  }
  
  async getChatRecords(profileId: number, pageNum: number = 1, pageSize: number = 20): Promise<ChatRecordsResponse> {
    const params = new URLSearchParams({
      profileId: profileId.toString(),
      pageNum: pageNum.toString(),
      pageSize: pageSize.toString(),
    });
    
    const response = await fetch(`${this.baseURL}/ai/chat/records?${params}`);
    const result: ApiResponse<ChatRecordsResponse> = await response.json();
    
    if (result.code !== '200') {
      throw new Error(result.message || '获取聊天记录失败');
    }
    
    return result.data;
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
  
  async addAiItem(item: AiItem): Promise<void> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newItem = {
      ...item,
      id: item.id || `ai_${Date.now()}`,
      createdAt: item.createdAt || new Date().toISOString(),
      profileId: item.profileId || Math.floor(Math.random() * 9000) + 1000,
    };
    localAiList.push(newItem);
    console.log('AI项目已添加:', newItem);
  }
  
  async createAiItem(item: AiItem): Promise<AiItem> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newItem = {
      ...item,
      id: `ai_${Date.now()}`,
      createdAt: new Date().toISOString(),
      voice: item.voice || '系统默认音色',
      profileId: Math.floor(Math.random() * 9000) + 1000,
      voiceId: `model_${Math.floor(Math.random() * 1000) + 1}`,
    };
    localAiList.push(newItem);
    console.log('AI项目已创建:', newItem);
    return newItem;
  }
  
  async uploadVoiceInit(audioFile: File, relation?: string, voiceId?: string): Promise<VoiceInitResponse> {
    // 模拟音频上传和AI处理延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('上传音频文件:', audioFile.name, '关系:', relation, '音色ID:', voiceId);
    
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

