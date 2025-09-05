import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../contexts/AuthContext';
import { ApiResponse, handleApiError, handleApiResponse } from './apiUtils';

// const mod = "development";
const mod = "production";

// 认证管理器接口
interface AuthManager {
  // 登录相关
  login: (phone: string, password: string) => Promise<{ user: User; token: string }>;
  register: (userData: { phone: string; password: string; confirmPassword: string; name: string }) => Promise<{ user: User; token: string }>;
  logout: () => Promise<void>;
  
  // 用户信息管理
  getCurrentUser: () => Promise<User | null>;
  updateUserProfile: (userData: Partial<User>) => Promise<User>;
  
  // Token 管理
  getToken: () => Promise<string | null>;
  refreshToken: () => Promise<string>;
  validateToken: (token: string) => Promise<boolean>;
  
  // 密码管理
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (phone: string) => Promise<void>;
}

// 存储键名
const STORAGE_KEYS = {
  USER: '@loveConnect:user',
  TOKEN: '@loveConnect:token',
  REFRESH_TOKEN: '@loveConnect:refreshToken',
  IS_LOGGED_IN: '@loveConnect:isLoggedIn',
};

// 模拟的认证管理器实现（用于开发测试）
class AuthManagerMock implements AuthManager {
  private mockUsers: Map<string, User & { password: string }> = new Map();
  private currentToken: string | null = null;

  constructor() {
    // 初始化一些测试用户
    this.mockUsers.set('13800138000', {
      id: 'user_001',
      name: '张三',
      gender: '男',
      date: '1990-01-01',
      avatar: 'https://pan.heky.top/tmp/profile.png',
      phone: '13800138000',
      address: '北京市朝阳区',
      urgentPhone: '13900139000',
      email: '13800138000@loveconnect.com',
      password: '123456',
    });
  }

  async login(phone: string, password: string): Promise<{ user: User; token: string }> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = this.mockUsers.get(phone);
    if (!mockUser || mockUser.password !== password) {
      throw new Error('手机号或密码错误');
    }

    const token = this.generateToken();
    const { password: _, ...user } = mockUser;
    user.token = token;
    this.currentToken = token;

    // 存储到本地
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
      AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
      AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true'),
    ]);

    return { user, token };
  }

  async register(userData: { phone: string; password: string; confirmPassword: string; name: string }): Promise<{ user: User; token: string }> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (this.mockUsers.has(userData.phone)) {
      throw new Error('该手机号已被注册');
    }

    if (userData.password !== userData.confirmPassword) {
      throw new Error('两次输入的密码不一致');
    }

    const userId = `user_${Date.now()}`;
    const newUser = {
      id: userId,
      name: userData.name,
      gender: '',
      date: '',
      avatar: '',
      phone: userData.phone,
      address: '',
      urgentPhone: userData.phone,
      email: userData.phone + '@loveconnect.com',
      password: userData.password,
    };

    this.mockUsers.set(userData.phone, newUser);

    const token = this.generateToken();
    const { password: _, ...user } = newUser;
    (user as User).token = token;
    this.currentToken = token;

    // 存储到本地
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
      AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
      AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true'),
    ]);

    return { user, token };
  }

  async logout(): Promise<void> {
    this.currentToken = null;
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.USER),
      AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN),
    ]);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // 首先尝试从本地存储获取
      const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userStr) {
        return JSON.parse(userStr);
      }
      
      // 如果本地没有，尝试从服务器获取
      const token = await this.getToken();
      if (token) {
        const userInfo = await this.getUserInfo(token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userInfo));
        return userInfo;
      }
      
      return null;
    } catch (error) {
      console.error('获取当前用户失败:', error);
      return null;
    }
  }

  async updateUserProfile(userData: Partial<User>): Promise<User> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new Error('用户未登录');
    }

    const updatedUser = { ...currentUser, ...userData };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

    // 同时更新 mockUsers 中的数据
    if (updatedUser.phone) {
      const mockUser = this.mockUsers.get(updatedUser.phone);
      if (mockUser) {
        Object.assign(mockUser, userData);
      }
    }

    return updatedUser;
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('获取 token 失败:', error);
      return null;
    }
  }

  async refreshToken(): Promise<string> {
    // 模拟刷新 token
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newToken = this.generateToken();
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    this.currentToken = newToken;
    
    return newToken;
  }

  async validateToken(token: string): Promise<boolean> {
    // 模拟 token 验证
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 简单的 token 格式验证
    return token.startsWith('mock_token_') && token.length > 20;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser || !currentUser.phone) {
      throw new Error('用户未登录');
    }

    const mockUser = this.mockUsers.get(currentUser.phone);
    if (!mockUser || mockUser.password !== oldPassword) {
      throw new Error('原密码错误');
    }

    mockUser.password = newPassword;
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async resetPassword(phone: string): Promise<void> {
    if (!this.mockUsers.has(phone)) {
      throw new Error('该手机号未注册');
    }

    // 模拟发送重置密码短信
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`密码重置短信已发送到 ${phone}`);
  }

  private generateToken(): string {
    return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getUserInfo(token: string): Promise<User> {
    // 模拟根据token获取用户信息
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 简单验证token格式
    if (!token.startsWith('mock_token_')) {
      throw new Error('无效的token');
    }
    
    // 返回默认用户信息（在实际应用中应该根据token查找对应用户）
    return {
      id: 'user_001',
      name: '张三',
      gender: '男',
      date: '1990-01-01',
      avatar: 'https://pan.heky.top/tmp/profile.png',
      phone: '13800138000',
      address: '北京市朝阳区',
      urgentPhone: '13900139000',
      email: '13800138000@loveconnect.com',
    };
  }
}

// 实际的认证管理器实现（连接后端 API）
class AuthManagerImpl implements AuthManager {
  private baseURL: string;

  constructor(baseURL: string = 'http://192.168.1.6:8080') {
    this.baseURL = baseURL;
  }

  async login(phone: string, password: string): Promise<{ user: User; token: string }> {
    try {
      console.log("login", phone, password);
      const response = await fetch(`${this.baseURL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const result: ApiResponse<string> = await response.json();
      const token = handleApiResponse(result);
      console.log(result);
      
      // 获取用户信息
      const userInfo = await this.getUserInfo(token);
      
      // 存储到本地
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userInfo)),
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
        AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true'),
      ]);

      return { user: userInfo, token };
    } catch (error) {
      console.error('登录失败:', error);
      handleApiError(error);
    }
  }

  async register(userData: { phone: string; password: string; confirmPassword: string; name: string }): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${this.baseURL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result: ApiResponse<string> = await response.json();
      const token = handleApiResponse(result);
      
      // 获取用户信息
      const userInfo = await this.getUserInfo(token);
      
      // 存储到本地
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userInfo)),
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
        AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true'),
      ]);

      return { user: userInfo, token };
    } catch (error) {
      handleApiError(error);
    }
  }

  async logout(): Promise<void> {
    const token = await this.getToken();
    if (token) {
      try {
        const response = await fetch(`${this.baseURL}/user/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const result: ApiResponse<any> = await response.json();
        handleApiResponse(result);
      } catch (error) {
        console.error('服务器登出失败:', error);
      }
    }

    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.USER),
      AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN),
    ]);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('获取当前用户失败:', error);
      return null;
    }
  }

  // 获取用户信息的私有方法
  private async getUserInfo(token: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseURL}/user/info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result: ApiResponse<any> = await response.json();
      const userData = handleApiResponse(result);
      
      return {
        id: userData.phone, // 使用手机号作为ID
        name: userData.name,
        gender: userData.gender || '',
        date: userData.birthday || '',
        avatar: userData.avatar || '',
        phone: userData.phone,
        address: userData.address || '',
        urgentPhone: userData.phone, // 默认使用主手机号
        email: userData.phone + '@loveconnect.com', // 生成默认邮箱
      };
    } catch (error) {
      handleApiError(error);
    }
  }

  async updateUserProfile(userData: Partial<User>): Promise<User> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('用户未登录');
    }

    try {
      // 转换为接口文档要求的格式
      const updateData: any = {};
      if (userData.name) updateData.name = userData.name;
      if (userData.avatar) updateData.avatar = userData.avatar;
      if (userData.gender) updateData.gender = userData.gender;
      if (userData.date) updateData.birthday = userData.date;
      if (userData.address) updateData.address = userData.address;

      const response = await fetch(`${this.baseURL}/user/updateuserinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const result: ApiResponse<any> = await response.json();
      const updatedUserData = handleApiResponse(result);

      const updatedUser: User = {
        id: updatedUserData.phone,
        name: updatedUserData.name,
        gender: updatedUserData.gender || '',
        date: updatedUserData.birthday || '',
        avatar: updatedUserData.avatar || '',
        phone: updatedUserData.phone,
        address: updatedUserData.address || '',
        urgentPhone: updatedUserData.phone,
        email: updatedUserData.phone + '@loveconnect.com',
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      handleApiError(error);
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('获取 token 失败:', error);
      return null;
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('刷新 token 不存在');
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const result: ApiResponse<{ token: string }> = await response.json();
      const data = handleApiResponse(result);
      
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      
      return data.token;
    } catch (error) {
      handleApiError(error);
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/auth/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const result: ApiResponse<any> = await response.json();
      handleApiResponse(result);
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('用户未登录');
    }

    try {
      const response = await fetch(`${this.baseURL}/user/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const result: ApiResponse<any> = await response.json();
      handleApiResponse(result);
    } catch (error) {
      handleApiError(error);
    }
  }

  async resetPassword(phone: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const result: ApiResponse<any> = await response.json();
      handleApiResponse(result);
    } catch (error) {
      handleApiError(error);
    }
  }
}

// 导出认证管理器实例
export const getAuthManager = (): AuthManager => {
  // 根据环境变量或配置决定使用哪个实现
  const isDevelopment = mod === 'development';
  
  if (isDevelopment) {
    return new AuthManagerMock();
  } else {
    console.log('使用生产环境认证管理器');
    return new AuthManagerImpl();
  }
};

export type { AuthManager, User };
