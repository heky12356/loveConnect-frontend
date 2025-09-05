import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserIsolatedStorage } from '../utils/storageUtils';

const STORAGE_KEY = "ImgMap";
const BASE_STORAGE_KEY = "ImgMap";

let imgMap = new Map();

const loadItems = async () => {
  try {
    // 尝试从新的用户隔离存储中获取数据
    const storedItems = await UserIsolatedStorage.getItem(BASE_STORAGE_KEY);
    if (storedItems) {
      imgMap = new Map(Object.entries(JSON.parse(storedItems)));
    }
  } catch (error) {
    console.error("加载数据失败:", error);
  }
};

loadItems();

imgMap.set("001", "https://pan.heky.top/tmp/profile.png");

export const useImg = () => {
  const addImg = async (key: string, img: string) => {
    imgMap.set(key, img);
    await UserIsolatedStorage.setItem(BASE_STORAGE_KEY, JSON.stringify(Object.fromEntries(imgMap)));
  };
  const getImg = (key: string) => {
    return imgMap.get(key);
  };
  return {
    addImg,
    getImg,
  } as const;
};
