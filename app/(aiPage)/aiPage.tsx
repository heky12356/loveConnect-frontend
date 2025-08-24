import AiChatButtons from "@/components/aiChatButtons";
import ReqChatItem from "@/components/reqChatItem";
import ReqpChatItem from "@/components/reqpChatItem";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

const { height, width } = Dimensions.get("window");
const profileimg = require("@/assets/images/profile.png");

const Profile = ({img}: {img?: string}) => {
  return (
    <View style={style.profileImgBox}>
      <Image source={img?{uri: img}:profileimg} resizeMode="cover" style={style.profileImg} />
    </View>
  );
};

const handleTitlePress = () => {
  router.push("/aiListPage");
};

export default function AiPage() {
  const [name, setName] = useState("");
  const [profileImg, setProfileImg] = useState<string>();

  const info = useLocalSearchParams<{
    data: string;
  }>();

  useEffect(() => {
    console.log(info);
    if (info.data) {
      const data = JSON.parse(decodeURIComponent(info.data));
      setName(data.name);
      if (data.img) {
        setProfileImg(data.img);
      }
    }
  }, []);

  return (
    <LinearGradient
      colors={["#FFD0D0", "#EDFFB8", "#FFFFFF", "#FFCBCB"]}
      locations={[0.1, 0.4, 0.5, 0.9]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
      }}
    >
      <View style={style.container}>
        <Pressable onPress={handleTitlePress}>
          <View style={style.title}>
            <Text style={style.titleText}>{name}</Text>
          </View>
        </Pressable>
        <View style={style.profile}>
          <Profile img={profileImg} />
        </View>
        <View style={style.content}>
          <ReqpChatItem time="12:00" />
          <ReqChatItem time="12:01" />
        </View>
        <View style={style.buttons}>
          <AiChatButtons />
        </View>
      </View>
    </LinearGradient>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  title: {
    paddingTop: height * 0.05,
    height: height * 0.15,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "blue",
  },
  titleText: {
    fontSize: width * 0.1,
    fontWeight: "bold",
    color: "black",
  },
  profile: {
    height: height * 0.3,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green",
  },
  profileImgBox: {
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.3,
    width: height * 0.3,
    borderRadius: height,
    backgroundColor: "white",
  },
  profileImg: {
    height: height * 0.25,
    width: height * 0.25,
    borderRadius: height,
  },
  content: {
    paddingTop: height * 0.03,
    height: height * 0.35,
    width: width,
    gap: height * 0.01,
    // justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  buttons: {
    height: height * 0.2,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "orange",
  },
});
