import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const guideLogo = require("@/assets/images/aiscreenn.png");

export default function AiSkipPage() {
  const [aiData, setAiData] = useState<any>(null);

  const data = useLocalSearchParams<{
    data: string;
  }>();

  useEffect(() => {
    if (data.data) {
      const decodedData = JSON.parse(decodeURIComponent(data.data));
      setAiData(decodedData);
    }
  }, [data.data]);

  const handleBackToQuestions = () => {
    // 返回问答页面
    router.back();
  };

  const handleNext = () => {
    // 跳转到定制化页面流程
    const updatedData = {
      ...aiData,
      chatScreenshots: [], // 跳过聊天截图
    };

    router.push(
      `/(aiProcessingPage)/aiProcessingPage?data=${encodeURIComponent(
        JSON.stringify(updatedData)
      )}`
    );
  };

  return (
    <LinearGradient
      colors={["#FFD0D0", "#EDFFB8", "#FFFFFF", "#FFCBCB"]}
      locations={[0.1, 0.4, 0.6, 0.9]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* AI消息卡片 */}
        <View style={styles.messageCard}>
          {/* 头像 */}
          <View style={styles.avatarContainer}>
            <Image
              source={guideLogo}
              style={styles.avatarImage}
            />
          </View>
          
          {/* 消息文字 */}
          <Text style={styles.messageText}>
            好呀~以后我会多听您的想法，好好陪您，让您每天都开开心心的~
          </Text>
        </View>

        {/* 按钮区域 */}
        <View style={styles.buttonContainer}>
          <Pressable 
            style={[styles.button, styles.backButton]}
            onPress={handleBackToQuestions}
          >
            <Text style={styles.backButtonText}>返回问答</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.button, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>下一步</Text>
          </Pressable>
        </View>

        {/* 返回按钮 */}
        <View style={styles.returnButtonContainer}>
          <Pressable 
            style={styles.returnButton}
            onPress={() => router.back()}
          >
            <Text style={styles.returnButtonText}>‹</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  messageCard: {
    backgroundColor: "#FFB6C1",
    borderRadius: width * 0.05,
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.04,
    marginBottom: height * 0.08,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: width * 0.85,
  },
  avatarContainer: {
    marginBottom: height * 0.02,
  },
  avatarImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.05,
  },
  messageText: {
    fontSize: width * 0.045,
    color: "#333",
    textAlign: "center",
    lineHeight: width * 0.065,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: width * 0.05,
    marginBottom: height * 0.1,
  },
  button: {
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.018,
    borderRadius: width * 0.05,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  backButton: {
    backgroundColor: "#FFB6C1",
  },
  nextButton: {
    backgroundColor: "#B8A9FF",
  },
  backButtonText: {
    fontSize: width * 0.04,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  nextButtonText: {
    fontSize: width * 0.04,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  returnButtonContainer: {
    position: "absolute",
    bottom: height * 0.05,
    left: width * 0.05,
  },
  returnButton: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: "#FF9999",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  returnButtonText: {
    fontSize: width * 0.06,
    color: "white",
    fontWeight: "bold",
  },
});