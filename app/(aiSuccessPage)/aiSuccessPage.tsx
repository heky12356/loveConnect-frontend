import ReturnButton from "@/components/returnButton";
import { Feather } from "@expo/vector-icons";
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

const guideLogo = require("@/assets/images/successLogo.png");

export default function AiSuccessPage() {
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

  const handleStartUsing = () => {
    // 跳转到主页面或AI列表页面
    router.push("/(aiListPage)/aiListPage");
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
        {/* 成功标题 */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>个性化定制成功！</Text>
        </View>

        {/* 头像区域 */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Image source={guideLogo} style={styles.avatarImage} />
          </View>
        </View>

        {/* 祝福文字 */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>祝您使用愉快！</Text>
        </View>

        {/* 开始使用按钮 */}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.startButton} onPress={handleStartUsing}>
            <Feather name="check-circle" size={width * 0.1} color="black"  style={
              {
               marginTop: height * 0.005
              }
            }/>
            <Text style={styles.startButtonText}>开始使用</Text>
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
    marginBottom: height * 0.04,
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
  titleContainer: {
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  titleText: {
    fontSize: width * 0.08,
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: height * 0.02,
  },
  successIndicator: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    backgroundColor: "#90EE90",
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
  successIcon: {
    fontSize: width * 0.08,
    color: "white",
    fontWeight: "bold",
  },
  messageContainer: {
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.03,
    marginBottom: height * 0.03,
  },
  messageText: {
    fontSize: width * 0.08,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
  buttonContainer: {
    marginBottom: height * 0.1,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD8D8",
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.02,
    borderRadius: width * 0.045,

    gap: width * 0.03,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonIcon: {
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: width * 0.03,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.03,
  },
  buttonIconText: {
    fontSize: width * 0.04,
    color: "#FFB6C1",
    fontWeight: "bold",
  },
  startButtonText: {
    fontSize: width * 0.08,
    color: "#333",
    fontWeight: "500",
    lineHeight: width * 0.08,
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
