import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../contexts/AuthContext';
import { UserIsolatedStorage } from '../utils/storageUtils';
import { ApiResponse, handleApiError, handleApiResponse } from './apiUtils';
import { isDevelopment, config } from './config';
import { getUploadManager } from './uploadManager';

// 为了向后兼容，保持原有的 Info 接口
interface Info {
  name: string;
  gender: string;
  date: string;
  avatar: string;
  phone: string;
  address: string;
  urgentPhone: string;
}

interface InfoManager {
  getInfo: () => Promise<Info>;
  getUrgentPhone: () => Promise<string>;
  updateInfo: (info: Info) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  updateGender: (gender: string) => Promise<void>;
  updateDate: (date: string) => Promise<void>;
  updateAvatar: (avatar: string) => Promise<void>;
  updatePhone: (phone: string) => Promise<void>;
  updateAddress: (address: string) => Promise<void>;
  // 新增方法
  initialize: () => Promise<void>;
  syncWithAuth: (user: User) => Promise<void>;
  // 后端API集成方法
  uploadAvatar: (imageFile: File) => Promise<string>;
  updateUserInfoToServer: (info: Partial<Info>) => Promise<void>;
  updatePhoneToServer: (newPhone: string) => Promise<void>;
  // 设置用户更新回调 - 用于同步AuthContext
  setUserUpdatedCallback: (callback: (updatedInfo: Partial<User>) => Promise<void>) => void;
}

// 存储键名
const STORAGE_KEY = '@loveConnect:userInfo';
const BASE_STORAGE_KEY = 'userInfo';

// 默认用户信息
let defaultInfo: Info = {
  name: "张三",
  gender: "男",
  date: "2023-01-01",
  avatar: "https://pan.heky.top/tmp/profile.png",
  phone: "114514",
  address: "中国",
  urgentPhone: "22333",
};

let currentInfo: Info = { ...defaultInfo };

// 增强的信息管理器，支持持久化存储和认证同步
class InfoManagerText implements InfoManager {
  private initialized = false;
  private baseURL = config.api.baseUrl;
  private userUpdatedCallback: ((updatedInfo: Partial<User>) => Promise<void>) | null = null;
  
  // 获取认证token
  private async getAuthToken(): Promise<string> {
    const token = await AsyncStorage.getItem('@loveConnect:token');
    if (!token) {
      throw new Error('用户未登录');
    }
    return token;
  }

  // 初始化方法，从本地存储加载数据
  async initialize() {
    if (this.initialized) return;
    
    try {
      const storedInfo = await UserIsolatedStorage.getItem(BASE_STORAGE_KEY);
      if (storedInfo) {
        currentInfo = JSON.parse(storedInfo);
      } else {
        // 尝试迁移旧数据
        const oldData = await AsyncStorage.getItem(STORAGE_KEY);
        if (oldData) {
          currentInfo = JSON.parse(oldData);
          // 迁移到新格式
          await this.saveToStorage();
          await AsyncStorage.removeItem(STORAGE_KEY);
          console.log('已迁移用户信息到新的存储格式');
        } else {
          // 如果没有存储的信息，使用默认信息并保存
          await this.saveToStorage();
        }
      }
    } catch (error) {
      console.error('初始化用户信息失败:', error);
      currentInfo = { ...defaultInfo };
    }
    
    this.initialized = true;
  }

  // 保存到本地存储
  private async saveToStorage() {
    try {
      await UserIsolatedStorage.setItem(BASE_STORAGE_KEY, JSON.stringify(currentInfo));
      ChangeFlag = !ChangeFlag;
    } catch (error) {
      console.error('保存用户信息失败:', error);
    }
  }

  // 与认证系统同步 - 智能合并策略
  async syncWithAuth(user: User) {
    try {
      if (!currentInfo) {
        // 如果本地没有数据，直接使用 auth 的数据
        currentInfo = {
          name: user.name,
          gender: user.gender,
          date: user.date,
          avatar: user.avatar,
          phone: user.phone,
          address: user.address,
          urgentPhone: user.urgentPhone,
        };
      } else {
        // 智能合并：只有在 AuthContext 中的字段为空或不同时才覆盖
        const updatedInfo = { ...currentInfo };

        // 只有当 AuthContext 中的字段不为空且与本地不同时才更新
        if (user.name && user.name !== currentInfo.name) updatedInfo.name = user.name;
        if (user.gender && user.gender !== currentInfo.gender) updatedInfo.gender = user.gender;
        if (user.date && user.date !== currentInfo.date) updatedInfo.date = user.date;
        if (user.avatar && user.avatar !== currentInfo.avatar) updatedInfo.avatar = user.avatar;
        if (user.phone && user.phone !== currentInfo.phone) updatedInfo.phone = user.phone;
        if (user.address && user.address !== currentInfo.address) updatedInfo.address = user.address;
        if (user.urgentPhone && user.urgentPhone !== currentInfo.urgentPhone) updatedInfo.urgentPhone = user.urgentPhone;

        currentInfo = updatedInfo;
      }

      await this.saveToStorage();
      console.log('智能同步完成 (Text):', currentInfo);
    } catch (error) {
      console.error('同步认证用户信息失败:', error);
    }
  }

  async getUrgentPhone() {
    await this.initialize();
    return currentInfo.urgentPhone;
  }

  async updateName(name: string) {
    await this.initialize();
    currentInfo.name = name;
    await this.saveToStorage();
  }

  async updateGender(gender: string) {
    await this.initialize();
    currentInfo.gender = gender;
    await this.saveToStorage();

    // 开发环境中，更新本地后立即调用回调
    if (this.userUpdatedCallback) {
      try {
        await this.userUpdatedCallback({ gender });
      } catch (error) {
        console.error('同步性别到AuthContext失败:', error);
      }
    }
  }

  async updateDate(date: string) {
    await this.initialize();
    currentInfo.date = date;
    await this.saveToStorage();

    // 开发环境中，更新本地后立即调用回调
    if (this.userUpdatedCallback) {
      try {
        await this.userUpdatedCallback({ date });
      } catch (error) {
        console.error('同步生日到AuthContext失败:', error);
      }
    }
  }

  async updateAvatar(avatar: string) {
    await this.initialize();
    currentInfo.avatar = avatar;
    await this.saveToStorage();
  }

  async updatePhone(phone: string) {
    await this.initialize();
    currentInfo.phone = phone;
    await this.saveToStorage();
  }

  async updateAddress(address: string) {
    await this.initialize();
    currentInfo.address = address;
    await this.saveToStorage();
  }

  async getInfo() {
    await this.initialize();
    return { ...currentInfo };
  }

  async updateInfo(info: Info) {
    await this.initialize();
    currentInfo = { ...info };
    await this.saveToStorage();
  }

  // 头像上传接口
  async uploadAvatar(imageFile: File): Promise<string> {
    try {
      const uploadManager = getUploadManager();
      const avatarUrl = await uploadManager.uploadAvatar(imageFile);
      
      // 更新本地头像信息
      await this.updateAvatar(avatarUrl);
      return avatarUrl;
    } catch (error) {
      handleApiError(error);
    }
  }

  // 更新用户信息到服务器
  async updateUserInfoToServer(info: Partial<Info>): Promise<void> {
    try {
      const token = await this.getAuthToken();
      
      // 转换前端字段到后端字段格式
      const serverData: any = {};
      if (info.name !== undefined) serverData.name = info.name;
      if (info.gender !== undefined) serverData.gender = info.gender;
      if (info.date !== undefined) serverData.birthday = info.date;
      if (info.avatar !== undefined) serverData.avatar = info.avatar;
      if (info.address !== undefined) serverData.address = info.address;
      if (info.urgentPhone !== undefined) serverData.urgentPhone = info.urgentPhone;

      const response = await fetch(`${this.baseURL}/user/updateuserinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(serverData),
      });

      const result: ApiResponse<any> = await response.json();
      handleApiResponse(result);
      
      // 更新本地信息 - 只更新指定的字段，避免覆盖其他字段
      const updatedInfo = { ...currentInfo, ...info };
      await this.updateInfo(updatedInfo);
    } catch (error) {
      handleApiError(error);
    }
  }

  // 更新手机号到服务器
  async updatePhoneToServer(newPhone: string): Promise<void> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(`${this.baseURL}/user/updatephone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: newPhone }),
      });

      const result: ApiResponse<any> = await response.json();
      handleApiResponse(result);
      
      // 更新本地手机号
      await this.updatePhone(newPhone);
    } catch (error) {
      handleApiError(error);
    }
  }

  // 设置用户更新回调
  setUserUpdatedCallback(callback: (updatedInfo: Partial<User>) => Promise<void>): void {
    this.userUpdatedCallback = callback;
  }
}

class InfoManagerImpl implements InfoManager {
  private baseURL = config.api.baseUrl;
  private currentInfo: Info | null = null;
  private initialized = false;
  private userUpdatedCallback: ((updatedInfo: Partial<User>) => Promise<void>) | null = null;

  // 获取认证token
  private async getAuthToken(): Promise<string> {
    const token = await AsyncStorage.getItem('@loveConnect:token');
    if (!token) {
      throw new Error('用户未登录');
    }
    return token;
  }

  // 初始化方法，从服务器获取用户信息
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.baseURL}/user/info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result: ApiResponse<any> = await response.json();
      const userData = handleApiResponse(result);
      console.log(userData);
      
      // 转换后端字段到前端字段格式
      this.currentInfo = {
        name: userData.name || '',
        gender: userData.gender || '',
        date: userData.birthday || '',
        avatar: userData.avatar || '',
        phone: userData.phone || '',
        address: userData.address || '',
        urgentPhone: userData.emergencyphone || '',
      };
      console.log(this.currentInfo);
      
      // 保存到本地存储
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentInfo));
      ChangeFlag = !ChangeFlag;
    } catch (error) {
      console.error('初始化用户信息失败:', error);
      // 尝试从本地存储加载
      const storedInfo = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedInfo) {
        this.currentInfo = JSON.parse(storedInfo);
      } else {
        this.currentInfo = { ...defaultInfo };
      }
    }
    
    this.initialized = true;
  }

  // 与认证系统同步 - 智能合并策略
  async syncWithAuth(user: User): Promise<void> {
    try {
      if (!this.currentInfo) {
        // 如果本地没有数据，直接使用 auth 的数据
        this.currentInfo = {
          name: user.name,
          gender: user.gender,
          date: user.date,
          avatar: user.avatar,
          phone: user.phone,
          address: user.address,
          urgentPhone: user.urgentPhone,
        };
      } else {
        // 智能合并：只有在 AuthContext 中的字段为空或不同时才覆盖
        const updatedInfo = { ...this.currentInfo };

        // 只有当 AuthContext 中的字段不为空且与本地不同时才更新
        if (user.name && user.name !== this.currentInfo.name) updatedInfo.name = user.name;
        if (user.gender && user.gender !== this.currentInfo.gender) updatedInfo.gender = user.gender;
        if (user.date && user.date !== this.currentInfo.date) updatedInfo.date = user.date;
        if (user.avatar && user.avatar !== this.currentInfo.avatar) updatedInfo.avatar = user.avatar;
        if (user.phone && user.phone !== this.currentInfo.phone) updatedInfo.phone = user.phone;
        if (user.address && user.address !== this.currentInfo.address) updatedInfo.address = user.address;
        if (user.urgentPhone && user.urgentPhone !== this.currentInfo.urgentPhone) updatedInfo.urgentPhone = user.urgentPhone;

        this.currentInfo = updatedInfo;
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentInfo));
      ChangeFlag = !ChangeFlag;
      console.log('智能同步完成:', this.currentInfo);
    } catch (error) {
      console.error('同步认证用户信息失败:', error);
    }
  }

  async getInfo(): Promise<Info> {
    await this.initialize();
    console.log("getinfo", this.currentInfo);
    return { ...this.currentInfo! };
  }

  async getUrgentPhone(): Promise<string> {
    await this.initialize();
    return this.currentInfo!.urgentPhone;
  }

  async updateInfo(info: Info): Promise<void> {
    await this.initialize();
    this.currentInfo = { ...info };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentInfo));
    ChangeFlag = !ChangeFlag;
  }

  async updateName(name: string): Promise<void> {
    await this.initialize();
    this.currentInfo!.name = name;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentInfo));
    await this.updateUserInfoToServer({ name });
    ChangeFlag = !ChangeFlag;
  }

  async updateGender(gender: string): Promise<void> {
    await this.initialize();
    console.log(gender);
    this.currentInfo!.gender = gender;
    console.log("updategender", this.currentInfo);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentInfo));
    ChangeFlag = !ChangeFlag;

    try {
      await this.updateUserInfoToServer({ gender });
      // 成功更新后调用回调通知AuthContext
      if (this.userUpdatedCallback) {
        await this.userUpdatedCallback({ gender });
      }
    } catch (error) {
      console.error('更新性别到服务器失败:', error);
      // API失败时，本地修改仍然有效，但不调用回调
    }
  }

  async updateDate(date: string): Promise<void> {
    await this.initialize();
    this.currentInfo!.date = date;
    // console.log("updatedate", this.currentInfo);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentInfo));
    ChangeFlag = !ChangeFlag;

    try {
      await this.updateUserInfoToServer({ date });
      // 成功更新后调用回调通知AuthContext
      if (this.userUpdatedCallback) {
        await this.userUpdatedCallback({ date });
      }
    } catch (error) {
      console.error('更新生日到服务器失败:', error);
      // API失败时，本地修改仍然有效，但不调用回调
    }
  }

  async updateAvatar(avatar: string): Promise<void> {
    await this.initialize();
    this.currentInfo!.avatar = avatar;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentInfo));
    ChangeFlag = !ChangeFlag;
  }

  async updatePhone(phone: string): Promise<void> {
    await this.initialize();
    this.currentInfo!.phone = phone;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentInfo));
    ChangeFlag = !ChangeFlag;
  }

  async updateAddress(address: string): Promise<void> {
    await this.initialize();
    this.currentInfo!.address = address;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentInfo));
    ChangeFlag = !ChangeFlag;
    await this.updateUserInfoToServer({ address });
  }

  // 头像上传接口
  async uploadAvatar(imageFile: File): Promise<string> {
    try {
      const uploadManager = getUploadManager();
      const avatarUrl = await uploadManager.uploadAvatar(imageFile);
      
      // 更新本地头像信息
      await this.updateAvatar(avatarUrl);
      return avatarUrl;
    } catch (error) {
      handleApiError(error);
    }
  }

  // 更新用户信息到服务器
  async updateUserInfoToServer(info: Partial<Info>): Promise<void> {
    try {
      const token = await this.getAuthToken();
      
      // 转换前端字段到后端字段格式
      const serverData: any = {};
      if (info.name !== undefined) serverData.name = info.name;
      if (info.gender !== undefined) serverData.gender = info.gender;
      if (info.date !== undefined) serverData.birthday = info.date;
      if (info.avatar !== undefined) serverData.avatar = info.avatar;
      if (info.address !== undefined) serverData.address = info.address;
      if (info.urgentPhone !== undefined) serverData.emergencyphone = info.urgentPhone;

      const response = await fetch(`${this.baseURL}/user/updateuserinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(serverData),
      });

      const result: ApiResponse<any> = await response.json();
      handleApiResponse(result);
      
      // 更新本地信息 - 只更新指定的字段，避免覆盖其他字段
      const updatedInfo = { ...this.currentInfo!, ...info };
      await this.updateInfo(updatedInfo);
    } catch (error) {
      handleApiError(error);
    }
  }

  // 更新手机号到服务器
  async updatePhoneToServer(newPhone: string): Promise<void> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(`${this.baseURL}/user/updatephone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newphone: newPhone }),
      });

      const result: ApiResponse<any> = await response.json();
      handleApiResponse(result);

      // 更新本地手机号
      await this.updatePhone(newPhone);
    } catch (error) {
      handleApiError(error);
    }
  }

  // 设置用户更新回调
  setUserUpdatedCallback(callback: (updatedInfo: Partial<User>) => Promise<void>): void {
    this.userUpdatedCallback = callback;
  }
}

// 单例实例
let infoManagerInstance: InfoManager | null = null;

export const getInfoManager = (): InfoManager => {
  // 如果已经有实例，直接返回
  if (infoManagerInstance) {
    return infoManagerInstance;
  }
  
  // 根据环境变量或配置决定使用哪个实现
  if (isDevelopment()) {
    infoManagerInstance = new InfoManagerText();
  } else {
    console.log('使用生产环境信息管理器');
    infoManagerInstance = new InfoManagerImpl();
  }
  
  return infoManagerInstance;
};

// 重置单例实例的方法（用于测试或特殊情况）
export const resetInfoManager = (): void => {
  infoManagerInstance = null;
};

export let ChangeFlag = false;