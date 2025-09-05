import AiListItem from "@/components/aiListItem";
import ReturnButton from "@/components/returnButton";
import { useImg } from "@/hook/useImg";
import { useWebSocket } from "@/hook/useWebSocket";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");
const GlobalFontSize = width * 0.3;
const exampleImg = useImg().getImg("001");

export default function MsgPage() {
  const { notifications, sendMessage } = useWebSocket();
  const [aiItems, setAiItems] = useState<{ name: string; img: string; postNum: number; hasNewMessage: boolean }[]>([]);

  useEffect(() => {
    console.log(notifications);
    // 当收到WebSocket消息时，更新对应的AI项状态
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      // 优先使用顶级aiName属性，如果没有则尝试从data中获取
      const aiName = latestNotification.aiName || (latestNotification.data && latestNotification.data.aiName);
      if (aiName) {
        setAiItems(prev => 
          prev.map(item => 
            item.name === aiName 
              ? { ...item, hasNewMessage: true, postNum: (item.postNum || 0) + 1 }
              : item
          )
        );
      }
    }
  }, [notifications]);

  const handleAiItemClick = (aiName: string) => {
    // 点击AI项时，清除新消息状态
    setAiItems(prev => 
      prev.map(item => 
        item.name === aiName 
          ? { ...item, hasNewMessage: false }
          : item
      )
    );
  };

  const testNotification = () => {
    const testMessage = {
      id: Date.now().toString(),
      title: '新消息',
      message: '您有一条来自女儿的新消息',
      type: 'info' as const,
      timestamp: Date.now(),
      aiName: '女儿', // 指定哪个AI发送了消息
      data: {
        aiName: '女儿'
      }
    };
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
          {aiItems.map((item, index) => (
            <AiListItem 
              key={index}
              name={item.name} 
              img={item.img}
              postNum={item.postNum}
              hasNewMessage={item.hasNewMessage}
              onPress={() => handleAiItemClick(item.name)}
            />
          ))}
          
          {/* 测试按钮 */}
          <Pressable style={styles.testButton} onPress={testNotification}>
            <Text style={styles.testButtonText}>测试新消息</Text>
          </Pressable>
          
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
    // justifyContent: "center",
    alignItems: "center",
    gap: height * 0.03,
    // backgroundColor: "blue",
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
