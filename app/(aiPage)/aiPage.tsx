import { getAuthManager } from "@/api/authManager";
import { msgManager } from "@/api/msgManager";
import {
  AiChatRequest,
  AiChatResponse,
} from "@/api/websocketManager";
import AiChatButtons from "@/components/aiChatButtons";
import ReqChatItem from "@/components/reqChatItem";
import ReqpChatItem from "@/components/reqpChatItem";
import { useWebSocket } from "@/hook/useWebSocket";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");
const profileimg = require("@/assets/images/profile.png");

const Profile = ({ img }: { img?: string }) => {
  return (
    <View style={style.profileImgBox}>
      <Image
        source={img ? { uri: img } : profileimg}
        resizeMode="cover"
        style={style.profileImg}
      />
    </View>
  );
};

const handleTitlePress = () => {
  router.push("/aiListPage");
};

export default function AiPage() {
  const [name, setName] = useState("");
  const [profileImg, setProfileImg] = useState<string>();
  const [messages, setMessages] = useState<any[]>([]);
  const [aiRoleId, setAiRoleId] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>(""); // 添加手机号状态
  const { isConnected, sendChatMessage, onChatResponse, offChatResponse } = useWebSocket();
  const scrollViewRef = useRef<ScrollView>(null);
  const nameRef = useRef<string>(""); // 用于保存最新的name值

  const info = useLocalSearchParams<{
    data: string;
  }>();

  useEffect(() => {
    const initializeAndLoadMessages = async () => {
      try {
        // 初始化msgManager
        await msgManager.initialize();
        console.log("msgManager初始化完成");

        // 获取当前用户手机号
        const authManager = getAuthManager();
        const currentUser = await authManager.getCurrentUser();
        if (currentUser?.phone) {
          setUserPhone(currentUser.phone);
          console.log("获取到用户手机号:", currentUser.phone);
        } else {
          console.warn("未能获取到用户手机号");
        }

        if (info.data) {
          const data = JSON.parse(decodeURIComponent(info.data));
          console.log("解析页面参数:", data);
          setName(data.name);
          nameRef.current = data.name; // 同步更新nameRef
          setAiRoleId(data.id || "default-ai-role");
          if (data.img) {
            setProfileImg(data.img);
          }
          // 直接加载消息
          loadMessages(data.name);
        }
      } catch (error) {
        console.error("初始化失败:", error);
      }
    };

    // 设置AI回复事件监听器
    const aiResponseHandler = (response: AiChatResponse) => {
      console.log("收到AI回复:", response);
      handleAiResponse(response);
    };

    const setupAiResponseListener = () => {
      // 先移除可能存在的旧监听器
      offChatResponse(aiResponseHandler);
      // 接收AI回复
      onChatResponse(aiResponseHandler);
    };

    initializeAndLoadMessages();
    setupAiResponseListener();

    // 清理函数
    return () => {
      offChatResponse(aiResponseHandler);
    };
  }, []);

  const loadMessages = (userName: string) => {
    const userMessages = msgManager.getMessages(userName);
    console.log("加载消息:", userMessages);
    setMessages(userMessages); // msgManager已经返回新的数组引用
  };

  // 滚动到底部
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // 监听messages变化，自动滚动到底部
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // 处理AI回复
  const handleAiResponse = async (response: AiChatResponse) => {
    console.log("处理AI回复:", response);
    if (response.code === 200) {
      console.log("AI回复数据:", response.data);
      const { aiText, aiVoiceBase64, userText } = response.data;

      // 添加AI回复消息到本地存储并直接更新状态
      const aiMessage = msgManager.createMessage(
        aiVoiceBase64 ? `data:audio/wav;base64,${aiVoiceBase64}` : undefined,
        "other",
        aiText
      );
      console.log("添加AI消息:", aiMessage);
      const updatedMessages = await msgManager.addMessage(nameRef.current, aiMessage);
      setMessages(updatedMessages); // 直接使用返回的消息列表更新状态
    } else {
      Alert.alert("AI回复错误", response.msg || "处理AI回复时出现错误");
    }
  };

  // 将音频文件转换为Base64
  const audioToBase64 = async (uri: string): Promise<string> => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("音频转Base64失败:", error);
      throw error;
    }
  };

  const handleRecordingComplete = async (uri: string) => {
    if (!nameRef.current || !aiRoleId) {
      Alert.alert("错误", "缺少必要信息，无法发送消息");
      return;
    }

    try {
      // 添加用户消息到本地存储并直接更新状态
      const newMessage = msgManager.createMessage(uri, "me", undefined);
      console.log("添加用户消息:", newMessage);
      const updatedMessages = await msgManager.addMessage(nameRef.current, newMessage);
      setMessages(updatedMessages); // 直接使用返回的消息列表更新状态

      // 检查WebSocket连接状态
      if (!isConnected) {
        Alert.alert("连接错误", "WebSocket未连接，请稍后重试");
        return;
      }

      // 转换音频为Base64并发送
      const voiceBase64 = await audioToBase64(uri);
      const chatRequest: AiChatRequest = {
        type: "user_voice",
        voiceBase64,
        aiRoleId: name,
        phone: userPhone, // 使用从AuthManager获取的手机号
      };

      console.log("发送聊天请求:", chatRequest);
      sendChatMessage(chatRequest);
    } catch (error) {
      console.error("发送消息失败:", error);
      Alert.alert("发送失败", "发送语音消息时出现错误");
    }
  };

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
          <ScrollView
            ref={scrollViewRef}
            style={style.scrollView}
            contentContainerStyle={style.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message, index) => {
              if (message.sender === "other") {
                return (
                  <ReqpChatItem
                    key={index}
                    time={message.time}
                    uri={message.uri}
                    text={message.text}
                  />
                );
              } else {
                return (
                  <ReqChatItem
                    key={index}
                    time={message.time}
                    uri={message.uri}
                    text={message.text}
                  />
                );
              }
            })}
            {messages.length === 0 && <ReqpChatItem text="你好噢" />}
          </ScrollView>
        </View>
        <View style={style.buttons}>
          <AiChatButtons onRecordingComplete={handleRecordingComplete} />
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
  connectionStatus: {
    marginTop: height * 0.01,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.005,
    borderRadius: width * 0.02,
  },
  connectionText: {
    fontSize: width * 0.03,
    color: "white",
    fontWeight: "500",
  },
  profile: {
    height: height * 0.2,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green",
  },
  profileImgBox: {
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.18,
    width: height * 0.18,
    borderRadius: height,
    backgroundColor: "white",
  },
  profileImg: {
    height: height * 0.15,
    width: height * 0.15,
    borderRadius: height,
  },
  content: {
    paddingTop: height * 0.02,
    height: height * 0.45,
    width: width,
    // backgroundColor: "green",
    alignItems: "center",
    // justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    width: width,
  },
  scrollContent: {
    gap: height * 0.01,
    alignItems: "center",
    paddingVertical: height * 0.01,
  },
  buttons: {
    height: height * 0.2,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "orange",
  },
});
