import { getAiManager } from "@/api/aiManeger";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
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
  const [isProcessing, setIsProcessing] = useState(false);

  // 使用 useRef 防止重复执行
  const hasProcessed = useRef(false);
  const timeoutRef = useRef<number | null>(null);

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
    // 防止重复执行 - 如果已经处理过或正在处理中，直接返回
    if (!aiData || hasProcessed.current || isProcessing) {
      return;
    }

    const processAiPersonalization = async () => {
      // 检查是否有必要的数据
      if (!aiData.relation || !aiData.chatImages) {
        console.log('缺少必要数据，跳过AI个性化处理');

        // 设置5秒后跳转（无个性化处理）
        timeoutRef.current = setTimeout(() => {
          router.push(
            `/(aiSuccessPage)/aiSuccessPage?data=${encodeURIComponent(
              JSON.stringify(aiData)
            )}`
          );
        }, 5000);
        return;
      }

      // 标记开始处理
      hasProcessed.current = true;
      setIsProcessing(true);

      try {
        // 进度条动画 - 8秒给API调用时间
        Animated.timing(progress, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: false,
        }).start();

        console.log('开始AI个性化处理:', {
          relation: aiData.relation,
          imageCount: aiData.chatImages?.length
        });

        // 调用AI个性化API
        const aiManager = getAiManager();
        const personalizationResult = await aiManager.initPersonalization(
          aiData.relation,
          aiData.chatImages
        );

        console.log('✅ AI个性化完成:', personalizationResult);

        // 如果有问卷数据，记录但不发送
        if (aiData.personalityAnswers) {
          console.log('📝 问卷数据已收集，等待后端API:', aiData.personalityAnswers);
        }

        // 等待动画完成后跳转
        timeoutRef.current = setTimeout(() => {
          router.push(
            `/(aiSuccessPage)/aiSuccessPage?data=${encodeURIComponent(
              JSON.stringify({
                ...aiData,
                personalizationResult,
                status: 'completed'
              })
            )}`
          );
        }, 8000);

      } catch (error) {
        console.error('AI个性化失败:', error);

        // 错误处理，但不阻断流程
        Alert.alert(
          "提示",
          "AI个性化处理失败，但数据已保存。是否继续？",
          [
            {
              text: "重试",
              onPress: () => {
                // 重置状态，允许重试
                hasProcessed.current = false;
                setIsProcessing(false);
                router.back();
              }
            },
            {
              text: "继续",
              onPress: () => {
                timeoutRef.current = setTimeout(() => {
                  router.push(
                    `/(aiSuccessPage)/aiSuccessPage?data=${encodeURIComponent(
                      JSON.stringify({
                        ...aiData,
                        status: 'partial_complete'
                      })
                    )}`
                  );
                }, 2000);
              }
            }
          ]
        );
      } finally {
        setIsProcessing(false);
      }
    };

    processAiPersonalization();

    // 清理函数 - 组件卸载时清理定时器
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [aiData]); // 只依赖 aiData 的变化

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