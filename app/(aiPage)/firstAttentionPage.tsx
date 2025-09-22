import { getAiManager } from "@/api/aiManeger";
import NormalNavBar from "@/components/normalNavBar";
import { useFirstAttention } from "@/hook/getFirstAttention";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");
const iconSize = width * 0.18;

const handleFirstAttention = async ({
  isFirstAttention,
  setIsFirstAttention,
  aiData,
}: {
  isFirstAttention: boolean;
  setIsFirstAttention: (isFirstAttention: boolean) => void;
  aiData: any;
}) => {
  try {
    // 如果有voiceId，调用确认API
    if (aiData?.voiceInitData?.voiceId) {
      const aiManager = getAiManager();
      await aiManager.confirmVoice(aiData.voiceInitData.voiceId, true);
      console.log('✅ 声音确认成功');
    }

    setIsFirstAttention(false);

    // 如果有AI数据，跳转到聊天准备页面；否则跳转到AI列表页面
    if (aiData) {
      router.push(
        `/(aiChatPreparePage)/aiChatPreparePage?data=${encodeURIComponent(
          JSON.stringify(aiData)
        )}`
      );
    } else {
      router.push("/(aiListPage)/aiListPage");
    }
  } catch (error) {
    console.error('声音确认失败:', error);
    Alert.alert("错误", "声音确认失败，但将继续流程");

    setIsFirstAttention(false);
    if (aiData) {
      router.push(
        `/(aiChatPreparePage)/aiChatPreparePage?data=${encodeURIComponent(
          JSON.stringify(aiData)
        )}`
      );
    } else {
      router.push("/(aiListPage)/aiListPage");
    }
  }
};

const handleFeedback = async ({
  isFirstAttention,
  setIsFirstAttention,
  aiData,
}: {
  isFirstAttention: boolean;
  setIsFirstAttention: (isFirstAttention: boolean) => void;
  aiData: any;
}) => {
  try {
    // 如果有voiceId，调用确认API表示不像
    if (aiData?.voiceInitData?.voiceId) {
      const aiManager = getAiManager();
      await aiManager.confirmVoice(aiData.voiceInitData.voiceId, false);
      console.log('✅ 声音确认为不像，已通知后端删除');
    }

    setIsFirstAttention(false);
    Alert.alert(
      "重新录制",
      "将返回重新录制声音",
      [
        {
          text: "确定",
          onPress: () => router.push("/(aiVoiceSetPage)/aiVoiceSetPage")
        }
      ]
    );
  } catch (error) {
    console.error('声音确认失败:', error);
    Alert.alert("错误", "确认失败，请手动返回重新录制");
    setIsFirstAttention(false);
    router.push("/(aiVoiceSetPage)/aiVoiceSetPage");
  }
};

const RadiusButton = ({
  color,
  text,
  onPress,
}: {
  color: string;
  text: string;
  onPress?: () => void;
}) => {
  return (
    <Pressable onPress={onPress}>
      <View style={[{ backgroundColor: color }, styles.radiusButton]}>
        <Text style={styles.radiusButtonText}>{text}</Text>
      </View>
    </Pressable>
  );
};

export default function FirstAttentionPage() {
  const [isFirstAttention, setIsFirstAttention] = useFirstAttention();
  const [aiData, setAiData] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const data = useLocalSearchParams<{
    data: string;
  }>();

  useEffect(() => {
    if (data.data) {
      const decodedData = JSON.parse(decodeURIComponent(data.data));
      setAiData(decodedData);
      console.log('AI数据:', decodedData);
    }
  }, [data.data]);

  // 播放AI生成的测试语音
  const playTestVoice = async () => {
    try {
      if (!aiData?.voiceInitData?.aiVoiceBase64) {
        Alert.alert("提示", "没有找到测试语音，请返回重新录制");
        return;
      }

      setIsPlaying(true);

      // 如果已有sound实例，先停止
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      // 创建新的sound实例播放Base64音频
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: aiData.voiceInitData.aiVoiceBase64 },
        { shouldPlay: true }
      );

      setSound(newSound);

      // 监听播放状态
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });

    } catch (error) {
      console.error('播放语音失败:', error);
      setIsPlaying(false);
      Alert.alert("错误", "播放失败，请检查语音文件");
    }
  };

  // 清理sound资源
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

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
      <View style={styles.container}>
        <View style={styles.navbar}>
          <NormalNavBar />
        </View>
        <View style={styles.attentionTextView}>
          <Text style={styles.attentionText}>听听是不是孩子的声音？</Text>
        </View>
        <View style={styles.judgeButton}>
          <View style={styles.judgeButtons}>
            <RadiusButton
              color="#A7BAFF"
              text="像孩子 的声音"
              onPress={() => {
                handleFirstAttention({ isFirstAttention, setIsFirstAttention, aiData });
              }}
            />
            <RadiusButton
              color="#FEB4BE"
              text="不太像，再改改"
              onPress={() => {
                handleFeedback({ isFirstAttention, setIsFirstAttention, aiData });
              }}
            />
          </View>
          <Text style={styles.judgeButtonViewText}>点击后，孩子会收到反馈</Text>
        </View>
        <View style={styles.judgeTextContainer}>
          <View style={styles.judgeTextView}>
            <Text style={styles.judgeTextTitle}>妈，下午去公园晒晒太阳吧</Text>
          </View>
        </View>
        <View style={styles.playButtonContainer}>
          <Pressable
            style={styles.playButton}
            onPress={playTestVoice}
            disabled={isPlaying}
          >
            <AntDesign
              name={isPlaying ? "loading1" : "sound"}
              size={iconSize}
              color="black"
            />
          </Pressable>
          <Text style={styles.playButtonText}>
            {isPlaying ? "播放中..." : "播放"}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    height: height,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  navbar: {
    height: height * 0.1,
    // backgroundColor: "blue",
  },
  attentionTextView: {
    height: height * 0.15,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green",
    paddingLeft: width * 0.1,
    paddingRight: width * 0.1,
  },
  attentionText: {
    fontSize: width * 0.1,
    fontWeight: "bold",
    // backgroundColor: "red",
  },
  judgeTextContainer: {
    height: height * 0.15,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "yellow",
  },
  judgeTextView: {
    height: height * 0.13,
    width: width * 0.8,
    borderRadius: width * 0.045,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    paddingLeft: width * 0.075,
    paddingRight: width * 0.025,
  },
  judgeTextTitle: {
    fontSize: width * 0.08,
    // fontWeight: "bold",
    // backgroundColor: "red",
  },
  judgeButton: {
    paddingTop: height * 0.02,
    height: height * 0.22,
    width: width,
    // justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "orange",
  },
  judgeButtons: {
    flexDirection: "row",
    height: height * 0.13,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "blue",
    gap: width * 0.05,
  },
  judgeButtonViewText: {
    fontSize: width * 0.035,
    color: "#646262",
  },
  radiusButton: {
    height: height * 0.09,
    width: width * 0.37,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "orange",
    borderRadius: width * 0.1,
    paddingLeft: width * 0.08,
    paddingRight: width * 0.02,
  },
  radiusButtonText: {
    fontSize: width * 0.065,
    // backgroundColor: 'red',
  },
  playButtonContainer: {
    paddingTop: height * 0.02,
    height: height * 0.38,
    width: width,
    // justifyContent: "center",
    alignItems: "center",
    gap: height * 0.03,
    // backgroundColor: "green",
  },
  playButton: {
    height: height * 0.2,
    width: height * 0.2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEB4BE",
    borderRadius: height * 0.2,
  },
  playButtonText: {
    fontSize: width * 0.09,
    // backgroundColor: 'red',
  },
});
