import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, handleApiError, handleApiResponse } from './apiUtils';
import { config, isDevelopment } from './config';

// const mod = "development";


// 头像上传响应接口
interface AvatarUploadResponse {
  url: string;
}

// 图床上传响应接口
interface ImageUploadResponse {
  url: string;
}

// 上传管理器接口
interface UploadManager {
  // 头像上传
  uploadAvatar: (imageFile: File) => Promise<string>;
  // 图床上传
  uploadImage: (imageFile: File) => Promise<string>;
}

// 生产环境的上传管理类实现
class UploadManagerImpl implements UploadManager {
  private baseURL = config.api.baseUrl; // 使用配置文件中的后端地址  
  
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('@loveConnect:token');
    } catch (error) {
      console.error('获取token失败:', error);
      return null;
    }
  }
  
  async uploadAvatar(imageFile: File): Promise<string> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('未找到认证令牌');
      }

      const formData = new FormData();
      // React Native FormData需要特殊格式
      formData.append('file', {
        uri: (imageFile as any).uri,
        name: (imageFile as any).name || 'avatar.jpg',
        type: (imageFile as any).type || 'image/jpeg'
      } as any);

      const response = await fetch(`${this.baseURL}/user/uploadAvatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result: ApiResponse<string> = await response.json();
      return handleApiResponse(result);
    } catch (error) {
      handleApiError(error);
    }
  }
  
  async uploadImage(imageFile: File): Promise<string> {
    try {
      const formData = new FormData();
      // React Native FormData需要特殊格式
      formData.append('file', {
        uri: (imageFile as any).uri,
        name: (imageFile as any).name || 'image.jpg',
        type: (imageFile as any).type || 'image/jpeg'
      } as any);

      const response = await fetch(`${this.baseURL}/user/imagebed`, {
        method: 'POST',
        body: formData,
      });

      console.log('上传图片响应状态:', response.status, response.ok);

      const result: ApiResponse<string> = await response.json();
      console.log('上传图片响应内容:', result);
      return handleApiResponse(result);
    } catch (error) {
      handleApiError(error);
    }
  }
}

// 开发环境的上传管理类实现（Mock）
class UploadManagerMock implements UploadManager {
  private static instance: UploadManagerMock;
  
  // 单例模式
  public static getInstance(): UploadManagerMock {
    if (!UploadManagerMock.instance) {
      UploadManagerMock.instance = new UploadManagerMock();
    }
    return UploadManagerMock.instance;
  }
  
  private constructor() {}
  
  async uploadAvatar(imageFile: File): Promise<string> {
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('模拟头像上传:', imageFile.name);
    
    // 模拟返回头像URL
    const mockAvatarUrl = `http://localhost:8080/avatars/avatar_${Date.now()}.jpg`;
    return mockAvatarUrl;
  }
  
  async uploadImage(imageFile: File): Promise<string> {
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('模拟图片上传:', imageFile.name);
    
    // 模拟返回图片URL
    const mockImageUrl = `http://localhost:8080/images/image_${Date.now()}.jpg`;
    return mockImageUrl;
  }
}

// 单例实例
let uploadManagerInstance: UploadManager | null = null;

// 导出上传管理器实例
export const getUploadManager = (): UploadManager => {
  if (!uploadManagerInstance) {
    if (isDevelopment()) {
      uploadManagerInstance = UploadManagerMock.getInstance();
    } else {
      uploadManagerInstance = new UploadManagerImpl();
    }
  }
  
  return uploadManagerInstance;
};

export type {
  AvatarUploadResponse,
  ImageUploadResponse, UploadManager
};
