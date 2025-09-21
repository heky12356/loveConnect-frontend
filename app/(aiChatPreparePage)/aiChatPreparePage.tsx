import ReturnButton from "@/components/returnButton";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
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

export default function AiChatPreparePage() {
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

  const handleNext = () => {
    router.push(
      `/(aiChatScreenshotPage)/aiChatScreenshotPage?data=${encodeURIComponent(
        JSON.stringify(aiData)
      )}`
    );
  };

  const handleSkip = () => {
    const updatedData = {
      ...aiData,
      chatScreenshots: [],
    };

    router.push(
      `/(aiSkipPage)/aiSkipPage?data=${encodeURIComponent(
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
        {/* 标题区域 */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>请上传您的聊天截图</Text>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Image source={guideLogo} style={styles.avatarImage} />
            </View>
          </View>
          {/* 中间添加按钮 */}
          <Pressable style={styles.contentContainer} onPress={handleNext}>
            <FontAwesome6 name="add" size={width * 0.15} color="black" />
          </Pressable>
        </View>

        {/* 底部按钮区域 */}
        <View style={styles.buttonContainer}>
          <ReturnButton />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * 0.15,
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    gap: width * 0.05,
  },
  avatarContainer: {
    marginBottom: height * 0.02,
  },
  avatar: {
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: width * 0.075,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: width * 0.075,
  },
  title: {
    fontSize: width * 0.08,
    // fontWeight: "600",
    color: "#333",
    marginBottom: height * 0.01,
    textAlign: "center",
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#666",
    textAlign: "center",
    lineHeight: width * 0.055,
  },
  contentContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    height: width * 0.4,
    width: width * 0.4,
    borderRadius: width * 0.4,
    backgroundColor: "#FEB4BE",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.03,
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.03,
  },
  skipButton: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: width * 0.03,
  },
  skipButtonText: {
    fontSize: width * 0.04,
    color: "#666",
  },
  addButtonText: {
    fontSize: width * 0.04,
    color: "#666",
  },
});
