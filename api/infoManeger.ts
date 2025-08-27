import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../contexts/AuthContext';

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
}

// 存储键名
const STORAGE_KEY = '@loveConnect:userInfo';

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

  // 初始化方法，从本地存储加载数据
  async initialize() {
    if (this.initialized) return;
    
    try {
      const storedInfo = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedInfo) {
        currentInfo = JSON.parse(storedInfo);
      } else {
        // 如果没有存储的信息，使用默认信息并保存
        await this.saveToStorage();
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
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentInfo));
      ChangeFlag = !ChangeFlag;
    } catch (error) {
      console.error('保存用户信息失败:', error);
    }
  }

  // 与认证系统同步
  async syncWithAuth(user: User) {
    try {
      currentInfo = {
        name: user.name,
        gender: user.gender,
        date: user.date,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        urgentPhone: user.urgentPhone,
      };
      await this.saveToStorage();
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
  }

  async updateDate(date: string) {
    await this.initialize();
    currentInfo.date = date;
    await this.saveToStorage();
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
}

export const getInfoManager = () => {
  return new InfoManagerText();
}

export let ChangeFlag = false;