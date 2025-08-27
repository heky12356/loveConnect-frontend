import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../contexts/AuthContext';

const mod = "development";
// const mod = "production";

// 认证管理器接口
interface AuthManager {
  // 登录相关
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  register: (userData: Omit<User, 'id' | 'token'> & { password: string; email: string }) => Promise<{ user: User; token: string }>;
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
  resetPassword: (email: string) => Promise<void>;
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
    this.mockUsers.set('test@example.com', {
      id: 'user_001',
      name: '张三',
      gender: '男',
      date: '1990-01-01',
      avatar: 'https://pan.heky.top/tmp/profile.png',
      phone: '13800138000',
      address: '北京市朝阳区',
      urgentPhone: '13900139000',
      email: 'test@example.com',
      password: '123456',
    });
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = this.mockUsers.get(email);
    if (!mockUser || mockUser.password !== password) {
      throw new Error('邮箱或密码错误');
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

  async register(userData: Omit<User, 'id' | 'token'> & { password: string; email: string }): Promise<{ user: User; token: string }> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (this.mockUsers.has(userData.email)) {
      throw new Error('该邮箱已被注册');
    }

    const userId = `user_${Date.now()}`;
    const newUser = {
      ...userData,
      id: userId,
    };

    this.mockUsers.set(userData.email, newUser);

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
      const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
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
    if (updatedUser.email) {
      const mockUser = this.mockUsers.get(updatedUser.email);
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
    if (!currentUser || !currentUser.email) {
      throw new Error('用户未登录');
    }

    const mockUser = this.mockUsers.get(currentUser.email);
    if (!mockUser || mockUser.password !== oldPassword) {
      throw new Error('原密码错误');
    }

    mockUser.password = newPassword;
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async resetPassword(email: string): Promise<void> {
    if (!this.mockUsers.has(email)) {
      throw new Error('该邮箱未注册');
    }

    // 模拟发送重置密码邮件
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`密码重置邮件已发送到 ${email}`);
  }

  private generateToken(): string {
    return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 实际的认证管理器实现（连接后端 API）
class AuthManagerImpl implements AuthManager {
  private baseURL: string;

  constructor(baseURL: string = 'https://api.loveconnect.com') {
    this.baseURL = baseURL;
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '登录失败');
    }

    const data = await response.json();
    
    // 存储到本地
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user)),
      AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token),
      AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true'),
    ]);

    return data;
  }

  async register(userData: Omit<User, 'id' | 'token'> & { password: string; email: string }): Promise<{ user: User; token: string }> {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '注册失败');
    }

    const data = await response.json();
    
    // 存储到本地
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user)),
      AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token),
      AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true'),
    ]);

    return data;
  }

  async logout(): Promise<void> {
    const token = await this.getToken();
    if (token) {
      try {
        await fetch(`${this.baseURL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
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

  async updateUserProfile(userData: Partial<User>): Promise<User> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('用户未登录');
    }

    const response = await fetch(`${this.baseURL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '更新用户信息失败');
    }

    const updatedUser = await response.json();
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    
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
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('刷新 token 不存在');
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('刷新 token 失败');
    }

    const data = await response.json();
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    
    return data.token;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/auth/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('用户未登录');
    }

    const response = await fetch(`${this.baseURL}/user/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '修改密码失败');
    }
  }

  async resetPassword(email: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '重置密码失败');
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
    return new AuthManagerImpl();
  }
};

export type { AuthManager, User };
