import ReturnButton from "@/components/returnButton";
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

const guideLogo = require("@/assets/images/feedbackLogo.png");

export default function AiThankYouPage() {
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

  const handleComplete = () => {
    // 3秒后自动跳转到加载页面
    setTimeout(() => {
      router.push(
        `/(aiProcessingPage)/aiProcessingPage?data=${encodeURIComponent(
          JSON.stringify(aiData)
        )}`
      );
    }, 3000);
  };

  useEffect(() => {
    // 页面加载后自动开始倒计时
    handleComplete();
  }, []);

  return (
    <LinearGradient
      colors={["#FFD0D0", "#EDFFB8", "#FFFFFF", "#FFCBCB"]}
      locations={[0.1, 0.4, 0.6, 0.9]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* 头像区域 */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Image
              source={guideLogo}
              style={styles.avatarImage}
            />
          </View>
        </View>

        {/* 感谢文字区域 */}
        <View style={styles.messageContainer}>
          <Text style={styles.thankYouText}>
            谢谢您呀！我会照着您的心意做，让您天天开心~
          </Text>
        </View>

        {/* 完成按钮 */}
        <View style={styles.buttonContainer}>
          <Pressable 
            style={styles.completeButton}
            onPress={() => {
              router.push(
                `/(aiProcessingPage)/aiProcessingPage?data=${encodeURIComponent(
                  JSON.stringify(aiData)
                )}`
              );
            }}
          >
            <Text style={styles.completeButtonText}>完成</Text>
          </Pressable>
        </View>

        {/* 返回按钮区域 */}
        <View style={styles.returnButtonContainer}>
          <ReturnButton />
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
  avatarContainer: {
    marginBottom: height * 0.05,
  },
  avatar: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: width * 0.1,
  },
  messageContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: width * 0.05,
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.04,
    marginBottom: height * 0.08,
  },
  thankYouText: {
    fontSize: width * 0.055,
    color: "#333",
    textAlign: "center",
    lineHeight: width * 0.08,
    fontWeight: "500",
  },
  buttonContainer: {
    marginBottom: height * 0.1,
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD8D8",
    width: width * 0.3,
    paddingVertical: height * 0.01,
    borderRadius: width * 0.04,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,

    display: "flex",
    justifyContent: "center",
  },
  checkIcon: {
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: width * 0.03,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.03,
  },
  checkText: {
    fontSize: width * 0.04,
    color: "#B8A9FF",
    fontWeight: "bold",
  },
  completeButtonText: {
    fontSize: width * 0.07,
    color: "#333",
    fontWeight: "600",
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