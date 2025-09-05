import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { UserIsolatedStorage } from '../utils/storageUtils';

// 用户信息接口
export interface User {
  id: string;
  name: string;
  gender: string;
  date: string;
  avatar: string;
  phone: string;
  address: string;
  urgentPhone: string;
  email?: string;
  token?: string;
}

// 认证状态接口
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  token: string | null;
}

// 认证上下文接口
interface AuthContextType extends AuthState {
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  isInitialized: boolean;
  isAuthenticated: boolean; // 认证状态的别名，等同于 isLoggedIn
}

// 存储键名
const STORAGE_KEYS = {
  USER: '@loveConnect:user',
  TOKEN: '@loveConnect:token',
  IS_LOGGED_IN: '@loveConnect:isLoggedIn',
};

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoggedIn: false,
    isLoading: true,
    token: null,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化认证状态
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const [storedUser, storedToken, storedIsLoggedIn] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN),
      ]);

      if (storedUser && storedToken && storedIsLoggedIn === 'true') {
        const user: User = JSON.parse(storedUser);
        setAuthState({
          user,
          isLoggedIn: true,
          isLoading: false,
          token: storedToken,
        });
      } else {
        // 如果没有存储的认证信息，创建默认用户（兼容现有代码）
        const defaultUser: User = {
          id: 'default_user',
          name: "张三",
          gender: "男",
          date: "2023-01-01",
          avatar: "https://pan.heky.top/tmp/profile.png",
          phone: "114514",
          address: "中国",
          urgentPhone: "22333",
        };
        
        setAuthState({
          user: defaultUser,
          isLoggedIn: false, // 默认用户未登录状态
          isLoading: false,
          token: null,
        });
      }
    } catch (error) {
      console.error('初始化认证状态失败:', error);
      setAuthState({
        user: null,
        isLoggedIn: false,
        isLoading: false,
        token: null,
      });
    } finally {
      setIsInitialized(true);
    }
  };

  // 登录函数
  const login = async (userData: User, token: string) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)),
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
        AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true'),
      ]);

      setAuthState({
        user: userData,
        isLoggedIn: true,
        isLoading: false,
        token,
      });
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  };

  // 登出函数
  const logout = async () => {
    try {
      // 获取当前用户手机号，用于清除用户数据
      const userPhone = authState.user?.phone;
      
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN),
      ]);

      // 清除该用户的所有本地数据
      if (userPhone) {
        await UserIsolatedStorage.clearUserData(userPhone);
        console.log(`已清除用户 ${userPhone} 的所有本地数据`);
      }

      setAuthState({
        user: null,
        isLoggedIn: false,
        isLoading: false,
        token: null,
      });
    } catch (error) {
      console.error('登出失败:', error);
      throw error;
    }
  };

  // 更新用户信息
  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!authState.user) {
        throw new Error('用户未登录');
      }

      const updatedUser = { ...authState.user, ...userData };
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  };

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        setAuthState(prev => ({ ...prev, user }));
      }
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    updateUser,
    refreshUser,
    isInitialized,
    isAuthenticated: authState.isLoggedIn, // 认证状态的别名
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 使用认证上下文的 Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 导出认证上下文（用于高级用法）
export { AuthContext };
