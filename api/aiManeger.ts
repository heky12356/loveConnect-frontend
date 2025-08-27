type AiItem = {
  id: string;
  name: string;
  img: string;
};

let localAiList: AiItem[] = [
  {
    id: "001",
    name: "女儿",
    img: "https://pan.heky.top/tmp/profile.png",
  },
];

interface AiManager {
  getAiList: () => Promise<AiItem[]>;
  addAiItem: (item: AiItem) => Promise<void>;
}

// 实际的AI管理类
// class AiManagerImpl implements AiManager {
//   async getAiList() {
//     return [
//       {
//         id: "001",
//         name: "AI1",
//         img: "https://pan.heky.top/tmp/profile.png",
//       },
//     ];
//   }
//   async addAiItem(item: AiItem) {
//     localAiList.push(item);
//   }
// }

// 测试用的AI管理类
class AiManagerTest implements AiManager {
  async getAiList() {
    return localAiList;
  }
  async addAiItem(item: AiItem) {
    localAiList.push(item);
  }
}

export const getAiManager = () => {
  //   return new AiManagerImpl();
  return new AiManagerTest();
};
