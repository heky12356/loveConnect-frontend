interface Info {
  name: string;
  gender: string;
  date: string;
  avatar: string;
  phone: string;
  address: string;
}

interface InfoManager {
  getInfo: () => Promise<Info>;
  updateInfo: (info: Info) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  updateGender: (gender: string) => Promise<void>;
  updateDate: (date: string) => Promise<void>;
  updateAvatar: (avatar: string) => Promise<void>;
  updatePhone: (phone: string) => Promise<void>;
  updateAddress: (address: string) => Promise<void>;
}

let textInfo: Info = {
  name: "张三",
  gender: "男",
  date: "2023-01-01",
  avatar: "https://pan.heky.top/tmp/profile.png",
  phone: "114514",
  address: "中国",
};

// 模拟用信息管理器
class InfoManagerText implements InfoManager {
  async updateName(name: string) {
    textInfo.name = name;
    ChangeFlag = !ChangeFlag;
  }
  async updateGender(gender: string) {
    textInfo.gender = gender;
    ChangeFlag = !ChangeFlag;
  }
  async updateDate(date: string) {
    textInfo.date = date;
    ChangeFlag = !ChangeFlag;
  }
  async updateAvatar(avatar: string) {
    textInfo.avatar = avatar;
    ChangeFlag = !ChangeFlag;
  }
  async updatePhone(phone: string) {
    textInfo.phone = phone;
    ChangeFlag = !ChangeFlag;
  }
  async updateAddress(address: string) {
    textInfo.address = address;
    ChangeFlag = !ChangeFlag;
  }
  async getInfo() {
    return textInfo;
  }
  async updateInfo(info: Info) {
    textInfo = info;
    // console.log(info);
    ChangeFlag = !ChangeFlag;
  }
}

export const getInfoManager = () => {
  return new InfoManagerText();
}

export let ChangeFlag = false;