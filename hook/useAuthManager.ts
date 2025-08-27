import { useEffect, useState } from 'react';
import { AuthManager, getAuthManager } from '../api/authManager';
import { getInfoManager } from '../api/infoManeger';
import { useAuth } from '../contexts/AuthContext';

// 认证管理 Hook
export const useAuthManager = () => {
  const { user, isLoggedIn, login, logout, updateUser, isLoading, isInitialized } = useAuth();
  const [authManager] = useState<AuthManager>(() => getAuthManager());
  const [infoManager] = useState(() => getInfoManager());
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 同步用户信息到 infoManager
  useEffect(() => {
    const syncUserInfo = async () => {
      if (user && isInitialized) {
        try {
          await infoManager.initialize();
          await infoManager.syncWithAuth(user);
        } catch (error) {
          console.error('同步用户信息失败:', error);
        }
      }
    };

    syncUserInfo();
  }, [user, isInitialized, infoManager]);

  // 登录函数
  const handleLogin = async (email: string, password: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const { user: userData, token } = await authManager.login(email, password);
      await login(userData, token);
      return userData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败';
      setError(errorMessage);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // 注册函数
  const handleRegister = async (userData: {
    name: string;
    gender: string;
    date: string;
    avatar: string;
    phone: string;
    address: string;
    urgentPhone: string;
    email: string;
    password: string;
  }) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const { user: newUser, token } = await authManager.register(userData);
      await login(newUser, token);
      return newUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '注册失败';
      setError(errorMessage);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // 登出函数
  const handleLogout = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      await authManager.logout();
      await logout();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登出失败';
      setError(errorMessage);
      console.error('登出失败:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 更新用户资料
  const handleUpdateProfile = async (profileData: Partial<{
    name: string;
    gender: string;
    date: string;
    avatar: string;
    phone: string;
    address: string;
    urgentPhone: string;
  }>) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('用户未登录');
      }

      // 更新认证系统中的用户信息
      const updatedUser = await authManager.updateUserProfile(profileData);
      await updateUser(updatedUser);
      
      // 同步到 infoManager
      await infoManager.syncWithAuth(updatedUser);
      
      return updatedUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新资料失败';
      setError(errorMessage);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // 修改密码
  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      await authManager.changePassword(oldPassword, newPassword);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '修改密码失败';
      setError(errorMessage);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // 重置密码
  const handleResetPassword = async (email: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      await authManager.resetPassword(email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '重置密码失败';
      setError(errorMessage);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // 获取当前 token
  const getToken = async () => {
    try {
      return await authManager.getToken();
    } catch (error) {
      console.error('获取 token 失败:', error);
      return null;
    }
  };

  // 验证 token
  const validateToken = async (token: string) => {
    try {
      return await authManager.validateToken(token);
    } catch (error) {
      console.error('验证 token 失败:', error);
      return false;
    }
  };

  // 清除错误
  const clearError = () => {
    setError(null);
  };

  return {
    // 状态
    user,
    isLoggedIn,
    isLoading: isLoading || isProcessing,
    isInitialized,
    error,
    
    // 认证操作
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    
    // 用户资料操作
    updateProfile: handleUpdateProfile,
    changePassword: handleChangePassword,
    resetPassword: handleResetPassword,
    
    // Token 操作
    getToken,
    validateToken,
    
    // 工具函数
    clearError,
    
    // 管理器实例（用于高级用法）
    authManager,
    infoManager,
  } as const;
};

// 导出类型
export type UseAuthManagerReturn = ReturnType<typeof useAuthManager>;