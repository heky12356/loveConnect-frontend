import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const guideLogo = require("@/assets/images/feedbackLogo.png");

export default function AiProcessingPage() {
  const [aiData, setAiData] = useState<any>(null);
  const [progress] = useState(new Animated.Value(0));
  const [dots, setDots] = useState("");

  const data = useLocalSearchParams<{
    data: string;
  }>();

  useEffect(() => {
    if (data.data) {
      const decodedData = JSON.parse(decodeURIComponent(data.data));
      setAiData(decodedData);
    }
  }, [data.data]);

  useEffect(() => {
    // 进度条动画
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000, // 5秒完成
      useNativeDriver: false,
    }).start();

    // 5秒后跳转到成功页面
    const timer = setTimeout(() => {
      router.push(
        `/(aiSuccessPage)/aiSuccessPage?data=${encodeURIComponent(
          JSON.stringify(aiData)
        )}`
      );
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 动态显示点点点效果
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
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
        {/* 标题文字 */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>个性化定制中{dots}</Text>
        </View>

                {/* 进度条区域 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </View>
        
        {/* 头像区域 */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Image
              source={guideLogo}
              style={styles.avatarImage}
            />
          </View>
        </View>

        {/* 提示文字 */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>请耐心等待~</Text>
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
    marginBottom: height * 0.04,
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.075,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: width * 0.075,
  },
  titleContainer: {
    marginBottom: height * 0.02,
  },
  titleText: {
    fontSize: width * 0.07,
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
  },
  subtitleContainer: {
    marginBottom: height * 0.06,
  },
  subtitleText: {
    fontSize: width * 0.045,
    color: "#666",
    textAlign: "center",
  },
  progressContainer: {
    width: width * 0.8,
    marginBottom: height * 0.06,
  },
  progressBarBackground: {
    height: height * 0.015,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: height * 0.0075,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFB1B1",
    borderRadius: height * 0.0075,
  },
  loadingContainer: {
    alignItems: "center",
  },
});