import { ChangeFlag, getInfoManager } from "@/api/infoManeger";
import { useAuth } from "@/contexts/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
  Alert,
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
const { height, width } = Dimensions.get("window");
const img: ImageSourcePropType = require("@/assets/images/avaretor_example.png");
const infoManager = getInfoManager();

type Prop = {
  style?: ViewStyle;
};

export default function NavBar({ style }: Prop) {
  const [profileImg, setProfileImg] = useState("");
  const [userName, setUserName] = useState("");
  const { logout } = useAuth();

  useEffect(() => {
    // console.log("NavBar useEffect");
    infoManager.getInfo().then((info) => {
      setProfileImg(info.avatar);
      setUserName(info.name);
    });
  }, [ChangeFlag]);

  const handleLogout = () => {
    Alert.alert("确认登出", "您确定要登出吗？", [
      { text: "取消", style: "cancel" },
      {
        text: "确定",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <View style={[styles.navbar, style]}>
      <View style={styles.avatar}>
        <Image
          source={{ uri: profileImg }}
          style={{
            width: width * 0.14,
            height: width * 0.14,
            borderRadius: width * 0.14,
          }}
        />
      </View>
      <View style={styles.content}>
        <View>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <Pressable
          onPress={() => {
            router.push("/profilePage");
          }}
        >
          <Text>点击切换/更改资料</Text>
        </Pressable>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialCommunityIcons
          name="logout"
          size={width * 0.06}
          color="#FF6B6B"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    // backgroundColor: "transparent",
    // backgroundColor: "green",
    // borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingTop: height * 0.05,
  },
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: width * 0.05,
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.15,
    backgroundColor: "white",
  },
  content: {
    // alignItems: "center",
    paddingLeft: width * 0.03,
    width: width * 0.55,
    // backgroundColor: "blue",
  },
  util: {
    flex: 1,
    flexDirection: "row",
    // justifyContent: "flex-end",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "flex-end",
    marginRight: width * 0.05,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: width * 0.02,
  },
});
