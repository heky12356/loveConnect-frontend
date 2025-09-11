import { getInfoManager } from "@/api/infoManeger";
import BigButton from "@/components/BigButton";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/contexts/AuthContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import Foundation from "@expo/vector-icons/Foundation";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

const handleAiQuestionPress = () => {
  router.push("/(aiListPage)/aiListPage");
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
        Alert.alert("错误", "您的设备不支持电话功能");
      }
    } catch (error) {
      Alert.alert("错误", "无法打开电话应用");
      console.error("电话拨打错误:", error);
    }
  };
  makePhoneCall();
};

export default function Index() {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const [mood, setMood] = useState("");

  const handleMoodPress = (mood: string) => {
    setMood(mood);
    console.log("Selected mood:", mood);
    // 这里可以添加心情记录逻辑
  };

  // 检查认证状态，如果未登录则跳转到登录页面
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/(auth)/login");
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
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ fontSize: width * 0.05, color: "#666" }}>加载中...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#FFFFFF", "#FFFFFF", "#FFFFFF"]}
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
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <NavBar style={styles.navbar} />

        {/* 心情询问区域 */}
        <View style={styles.moodSection}>
          <View
            style={{
              alignSelf: "flex-start",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {(() => {
              switch (mood) {
                case "happy":
                  return <Text style={styles.moodQuestion}>开心百分百</Text>;
                case "neutral":
                  return <Text style={styles.moodQuestion}>心情平淡中……</Text>;
                case "sad":
                  return (
                    <Text style={styles.moodQuestion}>悲伤如潮水般涌来</Text>
                  );
                case "angry":
                  return <Text style={styles.moodQuestion}>气愤无处喷发</Text>;
                default:
                  return (
                    <Text style={styles.moodQuestion}>
                      今天您的心情如何呢......?
                    </Text>
                  );
              }
            })()}
          </View>
          {mood === "" ? (
            <View style={styles.moodSelector}>
              <Pressable
                style={[styles.moodButton, { backgroundColor: "#FFB6C1" }]}
                onPress={() => handleMoodPress("happy")}
              >
                <Text style={styles.moodEmoji}>^O^</Text>
              </Pressable>
              <Pressable
                style={[styles.moodButton, { backgroundColor: "#FFEB9C" }]}
                onPress={() => handleMoodPress("neutral")}
              >
                <Text style={styles.moodEmoji}>⊙_⊙</Text>
              </Pressable>
              <Pressable
                style={[styles.moodButton, { backgroundColor: "#B6E5D8" }]}
                onPress={() => handleMoodPress("sad")}
              >
                <Text style={styles.moodEmoji}>T﹏T</Text>
              </Pressable>
              <Pressable
                style={[styles.moodButton, { backgroundColor: "#D3D3D3" }]}
                onPress={() => handleMoodPress("angry")}
              >
                <Text style={styles.moodEmoji}>｀へ´</Text>
              </Pressable>
            </View>
          ) : null}
          {mood !== "" && (
            <View style={styles.moodShower}>
              {(() => {
                switch (mood) {
                  case "happy":
                    return (
                      <View
                        style={[
                          styles.moodButton,
                          { backgroundColor: "#FFB6C1" },
                        ]}
                      >
                        <Text style={styles.moodEmoji}>^O^</Text>
                      </View>
                    );
                  case "happy":
                    return (
                      <View
                        style={[
                          styles.moodButton,
                          { backgroundColor: "#FFB6C1" },
                        ]}
                      >
                        <Text style={styles.moodEmoji}>^O^</Text>
                      </View>
                    );
                  case "angry":
                    return (
                      <View
                        style={[
                          styles.moodButton,
                          { backgroundColor: "#D3D3D3" },
                        ]}
                      >
                        <Text style={styles.moodEmoji}>｀へ´</Text>
                      </View>
                    );
                  case "neutral":
                    return (
                      <View
                        style={[
                          styles.moodButton,
                          { backgroundColor: "#FFEB9C" },
                        ]}
                      >
                        <Text style={styles.moodEmoji}>⊙_⊙</Text>
                      </View>
                    );
                  case "sad":
                    return (
                      <View
                        style={[
                          styles.moodButton,
                          { backgroundColor: "#B6E5D8" },
                        ]}
                      >
                        <Text style={styles.moodEmoji}>T﹏T</Text>
                      </View>
                    );
                }
              })()}
              {(() => {
                switch (mood) {
                  case "happy":
                    return (
                      <View
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={styles.moodText}>笑口常开，好运爆棚~</Text>
                      </View>
                    );
                  case "neutral":
                    return (
                      <View
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={styles.moodText}>平平淡淡才是真~</Text>
                      </View>
                    );
                  case "sad":
                    return (
                      <View
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={styles.moodText}>时间一去不复返……</Text>
                      </View>
                    );
                  case "angry":
                    return (
                      <View
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={styles.moodText}>
                          或许找人倾诉会比较好吧？
                        </Text>
                      </View>
                    );
                }
              })()}
            </View>
          )}
        </View>

        {/* AI问答卡片 */}
        <View style={styles.aiCardSection}>
          <Pressable style={styles.aiCard} onPress={handleAiQuestionPress}>
            <View style={styles.aiCardContent}>
              <View
                style={{
                  backgroundColor: "#FEADB4",
                  width: width * 0.035,
                  height: height * 0.16,
                }}
              ></View>
              <View>
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={{
                    width: width * 0.3,
                    height: width * 0.3,
                  }}
                />
              </View>
              <Text style={styles.aiCardText}>有问题，问AI</Text>
              <View
                style={{
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingRight: width * 0.02,
                }}
              >
                <AntDesign name="right" size={width * 0.05} color="black" />
              </View>
            </View>
          </Pressable>
        </View>

        {/* 消息通知区域 */}
        <View style={styles.notificationSection}>
          <Pressable style={styles.notificationItem} onPress={handleMsgPress}>
            <View
              style={{
                backgroundColor: "#FEADB4",
                width: width * 0.035,
                height: height * 0.06,
              }}
            ></View>
            <Text style={styles.notificationText}>消息通知</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>11</Text>
            </View>
            <View
              style={{
                height: height * 0.06,
                justifyContent: "center",
                alignItems: "center",
                paddingRight: width * 0.02,
              }}
            >
              <AntDesign name="right" size={width * 0.05} color="black" />
            </View>
          </Pressable>
        </View>

        {/* 底部功能区域 */}
        <View style={styles.bottomSection}>
          <BigButton
            onPress={handlePhonePress}
            label={"一键呼出"}
            icon={
              <Foundation
                name="telephone"
                size={GlobalFontSize * 0.8}
                color="black"
              />
            }
            backgroudColor="#D9E2FF"
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

        {/* 有问题点这里 */}
        <View style={styles.questionSection}>
          <View>
            <Text style={styles.questionText}>有问题?</Text>
            <Text style={styles.questionText}>点这里-&gt;</Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/feedbackLogo.png")}
              style={{
                width: width * 0.2,
                height: width * 0.2,
              }}
            />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  navbar: {
    width: width,
    height: height * 0.13,
    backgroundColor: "#FFCDCD",
  },
  moodSection: {
    paddingHorizontal: GlobalGap,
    paddingVertical: height * 0.02,
    alignItems: "center",
  },
  moodQuestion: {
    fontSize: width * 0.045,
    color: "#333",
    marginBottom: height * 0.02,
    fontWeight: "600",
    textAlign: "center",
  },
  moodSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.8,
    gap: width * 0.05,
  },
  moodShower: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: width * 0.8,
    gap: width * 0.05,
  },
  moodButton: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  moodEmoji: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#333",
  },
  moodText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#333",
  },
  aiCardSection: {
    width: width * 0.9,
    height: height * 0.2,

    paddingHorizontal: GlobalGap,
    paddingVertical: height * 0.02,
  },
  aiCard: {
    backgroundColor: "#FFE4E6",
    // width: width * 0.9,
    height: height * 0.16,
    // borderRadius: 15,
    // padding: width * 0.04,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  aiCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  aiCardIcon: {
    width: width * 0.12,
    height: width * 0.12,
    backgroundColor: "#FF9AA2",
    borderRadius: width * 0.06,
    justifyContent: "center",
    alignItems: "center",
  },
  aiCardEmoji: {
    fontSize: width * 0.06,
  },
  aiCardText: {
    fontSize: width * 0.045,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginLeft: width * 0.03,
  },
  aiCardArrow: {
    fontSize: width * 0.05,
    color: "#666",
    fontWeight: "bold",
  },
  notificationSection: {
    width: width * 0.9,
    paddingHorizontal: GlobalGap,
    paddingVertical: height * 0.01,
  },
  notificationItem: {
    backgroundColor: "#F5F5F5",
    // borderRadius: 10,
    // padding: width * 0.04,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: width * 0.05,
  },
  notificationText: {
    fontSize: width * 0.04,
    color: "#333",
    flex: 1,
  },
  notificationBadge: {
    backgroundColor: "#A4A3A3",
    borderRadius: width * 0.2,
    width: width * 0.09,
    height: width * 0.09,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.01,
    marginRight: width * 0.02,
  },
  notificationCount: {
    color: "white",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  notificationArrow: {
    fontSize: width * 0.04,
    color: "#666",
    fontWeight: "bold",
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: GlobalGap,
    paddingVertical: height * 0.02,
    gap: width * 0.05,
  },
  questionSection: {
    alignSelf: "flex-end",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: GlobalGap,
    paddingVertical: height * 0.02,
    alignItems: "center",
  },
  questionText: {
    fontSize: width * 0.035,
    color: "#333",
    // fontWeight: "600",
    textAlign: "center",
  },
});
