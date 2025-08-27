import { getInfoManager } from "@/api/infoManeger";
import BigButton from "@/components/BigButton";
import NavBar from "@/components/NavBar";
import AiLogoButton from "@/components/aiLogoButton";
import { useAuth } from "@/contexts/AuthContext";
import { useFirstAttention } from "@/hook/getFirstAttention";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Dimensions, Linking, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");
const infoManager = getInfoManager();
const GlobalGap = width * 0.05;
const GlobalFontSize = width * 0.1;

const handleTimingSetPress = () => {
  // console.log("TimingSet Pressed!");
  router.push("/(timingSet)/timingSet");
};

const handleActivitiesMapPress = () => {
  router.push("/(activitiesMap)/activitiesMap");
};

const handleMsgPress = () => {
  router.push("/(msgPage)/msgPage");
};

const handleStudyPagePress = () => {
  router.push("/(studyPage)/studyPage");
};

const handleFriendPress = () => {
  router.push("/(friendPage)/friendPage");
};

const handlePhonePress = async () => {
  // 后面需要修改下逻辑，获取紧急联系人电话
  const phoneNumber = await infoManager.getUrgentPhone();
  if (phoneNumber === "") {
    Alert.alert("错误", "请先联系管理员设置紧急联系人电话");
    return;
  }
  const makePhoneCall = async () => {
    const phoneUrl = `tel:${phoneNumber}`;
    try {
      // 检查设备是否支持电话功能
      const supported = await Linking.canOpenURL(phoneUrl);
      
      if (supported) {
        // 打开电话应用
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('错误', '您的设备不支持电话功能');
      }
    } catch (error) {
      Alert.alert('错误', '无法打开电话应用');
      console.error('电话拨打错误:', error);
    }
  }
  makePhoneCall();
};

export default function Index() {
  const [isFirstAttention, setIsFirstAttention] = useFirstAttention();
  const { user, isAuthenticated, logout, isInitialized } = useAuth();

  // 检查认证状态，如果未登录则跳转到登录页面
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isInitialized]);

  const handleProfilePress = () => {
    router.push('/(auth)/profile');
  };

  // 如果未初始化或未认证，显示加载状态
  if (!isInitialized || !isAuthenticated || !user) {
    return (
      <LinearGradient
        colors={["#FFE9EA", "#EDFFB8", "#FFFFFF"]}
        locations={[0.1, 0.4, 0.7]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{ fontSize: width * 0.05, color: '#666' }}>加载中...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#FFE9EA", "#EDFFB8", "#FFFFFF"]}
      locations={[0.1, 0.4, 0.7]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <NavBar style={styles.navbar} />
        <View style={styles.buttonContainer}>
          <View
            style={{
              flexDirection: "row",
              gap: GlobalGap,
            }}
          >
            <BigButton
              onPress={handlePhonePress}
              label={"一键呼出"}
              icon={
                <Foundation
                  name="telephone"
                  size={GlobalFontSize}
                  color="black"
                />
              }
              backgroudColor="#d9e2ff"
            />
            <BigButton
              onPress={handleActivitiesMapPress}
              label={"活动地图"}
              icon={
                <Feather name="map-pin" size={GlobalFontSize} color="black" />
              }
              backgroudColor="#FFDEE2"
            />
          </View>
          <View style={{ flexDirection: "row", gap: GlobalGap }}>
            <BigButton
              onPress={handleTimingSetPress}
              label={"定时设置"}
              icon={
                <Fontisto
                  name="heartbeat-alt"
                  size={GlobalFontSize}
                  color="black"
                />
              }
              backgroudColor="#ADFFD7"
            />
            <BigButton
              onPress={handleStudyPagePress}
              label={"学习乐园"}
              icon={
                <Feather name="book-open" size={GlobalFontSize} color="black" />
              }
              backgroudColor="#FFE7A4"
            />
          </View>
          <View style={{ flexDirection: "row", gap: GlobalGap }}>
            <BigButton
              onPress={handleMsgPress}
              label={"消息通知"}
              icon={
                <MaterialCommunityIcons
                  name="message-outline"
                  size={GlobalFontSize}
                  color="black"
                />
              }
              backgroudColor="#FFCDCD"
            />
            <BigButton
              onPress={handleFriendPress}
              label={"好友群组"}
              icon={
                <Feather name="users" size={GlobalFontSize} color="black" />
              }
              backgroudColor="#D9D9D9"
            />
          </View>
        </View>
        <View style={styles.logo}>
          <AiLogoButton label="有问题，问AI" isFirstAttention={isFirstAttention} setIsFirstAttention={setIsFirstAttention} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: height * 0.65,
    justifyContent: "center",
    alignItems: "center",
    gap: GlobalGap,
    // backgroundColor: "blue",
  },
  logo: {
    height: height * 0.22,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green",
  },
  navbar: {
    width: width,
    height: height * 0.13,
  },
});
