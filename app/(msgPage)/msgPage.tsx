import AiListItem from "@/components/aiListItem";
import ReturnButton from "@/components/returnButton";
import { useImg } from "@/hook/useImg";
import { useWebSocket } from "@/hook/useWebSocket";
import { useMessage } from "@/contexts/MessageContext";
import { notificationUtils } from "@/utils/notificationUtils";
import { getAiManager, AiItem } from "@/api/aiManeger";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View, ScrollView } from "react-native";

const { height, width } = Dimensions.get("window");
const GlobalFontSize = width * 0.3;
const exampleImg = useImg().getImg("001");

export default function MsgPage() {
  const { notifications, sendMessage } = useWebSocket();
  const { aiItems, loading, clearAiItemMessages } = useMessage();
  const exampleImg = useImg().getImg("001");

  // AI列表现在通过MessageContext管理，无需本地加载逻辑

  // WebSocket通知现在通过MessageContext处理

  const handleAiItemClick = (aiName: string) => {
    // 点击AI项时，清除新消息状态和消息数量
    clearAiItemMessages(aiName);
  };

  const testNotification = () => {
    // 清空去重缓存，确保每次测试都能成功
    notificationUtils.clearDeduplicationCache();
    
    const aiNames = ['女儿', '儿子', '妻子'];
    const randomAi = aiNames[Math.floor(Math.random() * aiNames.length)];
    const messageCount = Math.floor(Math.random() * 100) + 1;
    
    const testMessage = {
      id: Date.now().toString(),
      title: '新消息',
      message: `您有一条来自${randomAi}的新消息 #${messageCount}`,
      type: 'info' as const,
      timestamp: Date.now(),
      aiName: randomAi, // 随机选择AI发送消息
      data: {
        aiName: randomAi
      }
    };
    console.log('发送测试消息:', testMessage);
    console.log('去重缓存统计:', notificationUtils.getDeduplicationStats());
    sendMessage(testMessage);
  };

  return (
    <LinearGradient
      colors={["#FFD0D0", "#EDFFB8", "#FFFFFF", "#FFCBCB"]}
      locations={[0.08, 0.4, 0.6, 0.9]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons
            name="message-outline"
            size={GlobalFontSize}
            color="black"
          />
          <Text style={styles.logoText}>消息通知</Text>
        </View>
        <View style={styles.content}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <Text style={styles.loadingText}>加载中...</Text>
            ) : (
              aiItems.map((item) => (
                <AiListItem 
                  key={item.id}
                  name={item.name} 
                  img={item.img}
                  postNum={item.postNum}
                  hasNewMessage={item.hasNewMessage}
                  onPress={() => handleAiItemClick(item.name)}
                />
              ))
            )}
            
            {/* 测试按钮 */}
            <Pressable style={styles.testButton} onPress={testNotification}>
              <Text style={styles.testButtonText}>测试新消息</Text>
            </Pressable>
          </ScrollView>
          
          <Pressable
            style={styles.timeSetLink}
            onPress={() => {
              router.push("/(msgPage)/timeSet");
            }}
          >
            <Text style={styles.timeSetLinkText}>更改时间设置</Text>
            <AntDesign name="right" size={width * 0.07} color="black" />
          </Pressable>
        </View>
        <View style={styles.returnButton}>
          <ReturnButton />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  logoContainer: {
    paddingTop: height * 0.03,
    height: height * 0.26,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "white",
  },
  logoText: {
    fontSize: width * 0.1,
  },
  content: {
    paddingTop: height * 0.03,
    height: height * 0.61,
    width: width,
    // backgroundColor: "blue",
  },
  scrollView: {
    flex: 1,
    width: width,
  },
  scrollContent: {
    alignItems: "center",
    gap: height * 0.03,
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.02,
  },
  loadingText: {
    fontSize: width * 0.04,
    color: "#666",
    textAlign: "center",
    marginTop: height * 0.1,
  },
  timeSetLink: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: width,
    paddingRight: width * 0.07,
    gap: width * 0.01,
  },
  timeSetLinkText: {
    fontSize: width * 0.05,
    color: "#333",
  },
  testButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.015,
    borderRadius: 8,
  },
  testButtonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  returnButton: {
    height: height * 0.13,
    width: width,
    justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "orange",
    paddingLeft: width * 0.05,
    paddingBottom: height * 0.03,
  },
});
