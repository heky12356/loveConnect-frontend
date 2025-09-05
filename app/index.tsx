import { getInfoManager } from "@/api/infoManeger";
import BigButton from "@/components/BigButton";
import NavBar from "@/components/NavBar";
import AiLogoButton from "@/components/aiLogoButton";
import { useAuth } from "@/contexts/AuthContext";
import { useFirstAttention } from "@/hook/getFirstAttention";
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

// 删除：活动地图、学习乐园、好友群组 功能及跳转处理函数
// const handleActivitiesMapPress = () => { router.push("/(activitiesMap)/activitiesMap"); } 
// Remove unused handlers for deprecated features
// (学习乐园、好友群组)
// const handleStudyPagePress = () => { router.push("/(studyPage)/studyPage"); };
// const handleFriendPress = () => { router.push("/(friendPage)/friendPage"); };

const handleMsgPress = () => {
  router.push("/(msgPage)/msgPage");
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
  const { user, isAuthenticated, isInitialized } = useAuth();

  // 检查认证状态，如果未登录则跳转到登录页面
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isInitialized]);

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
        {/* 主要功能：AI问答 - 放在最显眼的位置 */}
        <View style={styles.aiSection}>
          <AiLogoButton label="" isFirstAttention={isFirstAttention} setIsFirstAttention={setIsFirstAttention} />
        </View>
        
        {/* 底部功能区域 */}
        <View style={styles.bottomSection}>
          {/* 左下角：一键呼出 */}
          <View style={styles.leftBottomSection}>
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
              backgroudColor="#FFD1D1"
            />
          </View>
          
          {/* 右下角：定时设置和消息通知 */}
          <View style={styles.rightBottomSection}>
            <BigButton
              onPress={handleMsgPress}
              label={"消息通知"}
              icon={
                <MaterialCommunityIcons
                  name="message-outline"
                  size={GlobalFontSize * 0.8}
                  color="black"
                />
              }
              backgroudColor="#FFCDCD"
            />
            <BigButton
              onPress={handleTimingSetPress}
              label={"定时设置"}
              icon={
                <Fontisto
                  name="heartbeat-alt"
                  size={GlobalFontSize * 0.8}
                  color="black"
                />
              }
              backgroudColor="#ADFFD7"
            />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  aiSection: {
    height: height * 0.5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.02,
  },
  bottomSection: {
    height: height * 0.37,
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "flex-end",
    paddingHorizontal: GlobalGap,
    paddingBottom: height * 0.05,
    width: width,
  },
  leftBottomSection: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  rightBottomSection: {
    flex: 0.4,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: GlobalGap,
  },
  navbar: {
    width: width,
    height: height * 0.13,
  },
});
