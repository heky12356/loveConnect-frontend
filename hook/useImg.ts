import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "ImgMap";

let imgMap = new Map();

const loadItems = async () => {
  try {
    const storedItems = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedItems) {
      imgMap = new Map(Object.entries(JSON.parse(storedItems)));
    }
  } catch (error) {
    console.error("加载数据失败:", error);
  }
};

loadItems();

imgMap.set("001", "https://pan.heky.top/17d64770e74a442aa93eca1d1cc0a139.jpg");

export const useImg = () => {
  const addImg = async (key: string, img: string) => {
    imgMap.set(key, img);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(imgMap)));
  };
  const getImg = (key: string) => {
    return imgMap.get(key);
  };
  return {
    addImg,
    getImg,
  } as const;
};
