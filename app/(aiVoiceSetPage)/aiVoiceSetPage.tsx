import { getAiManager, VoiceInitResponse, VoiceSaveRequest } from "@/api/aiManeger";
import { getAuthManager } from "@/api/authManager";
import CircleButton from "@/components/circleButton";
import EndButton from "@/components/endButton";
import ReturnButton from "@/components/returnButton";
import Feather from "@expo/vector-icons/Feather";
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");

const guideLogo = require("@/assets/images/feedbackLogo.png");

const Step1 = ({ setStep }: { setStep: (step: number) => void }) => {
  return (
    <View style={styles.content}>
      <Text style={styles.guideText}>
        {" "}
        欢迎使用牵念AI !! 下面让我们开始新手教程吧~{" "}
      </Text>
      <Pressable
        style={styles.startButton}
        onPress={() => {
          setStep(2);
        }}
      >
        <Text style={styles.ButtonText}> 开始 </Text>
      </Pressable>
    </View>
  );
};

const Step2 = ({ setStep }: { setStep: (step: number) => void }) => {
  return (
    <View style={styles.content}>
      <Text style={styles.guideText}> 请确保您的子女在您的身边 </Text>
      <View style={styles.buttonBox}>
        <Pressable
          style={styles.normalButton}
          onPress={() => {
            setStep(6);
          }}
        >
          <Text style={styles.ButtonText}> 跳过 </Text>
        </Pressable>
        <Pressable
          style={styles.normalButton}
          onPress={() => {
            setStep(3);
          }}
        >
          <Text style={styles.ButtonText}> 准备好了 </Text>
        </Pressable>
      </View>
    </View>
  );
};

const Step3 = ({
  setVoice,
}: {
  setVoice: (voice: string) => void;
}) => {

  return (
    <View style={styles.content}>
      <Text style={styles.guideText}> 接下来让ta读一下下面的话吧 </Text>
      <View style={styles.judgeTextView}>
        <Text style={styles.judgeTextTitle}>妈，下午去公园晒晒太阳吧</Text>
      </View>
      <Text style={styles.hintText}>
        请尽量在安静的环境里录入，太嘈杂的环境会导致AI效果不够好哦！
      </Text>
      <CircleButton bgColor="#FFF6AF" onRecordingComplete={setVoice}/>
    </View>
  );
};

const Step4 = ({
  voiceBase64,
  name,
  onComplete
}: {
  voiceBase64: string;
  name: string;
  onComplete: (voiceData: VoiceInitResponse) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initAiVoice = async () => {
      if (!voiceBase64) return;
      
      setIsLoading(true);
      try {
        // 使用AI管理器而不是直接调用API
        const aiManager = getAiManager();
        const result = await aiManager.uploadVoiceInit(voiceBase64, name);
        
        console.log('AI声音初始化成功:', result);
        
        // 保存结果并跳转到下一步
        onComplete(result);
        
      } catch (error) {
        console.error('AI声音初始化失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAiVoice();
  }, [voiceBase64, name, onComplete]);

  return (
    <View style={styles.content}>
      <Text style={styles.guideText}> 
        {isLoading ? '正在创建AI角色，请耐心等待...' : 'AI角色创建完成！'} 
      </Text>
    </View>
  );
};

const Step5 = ({ role, profileImg, voiceInitData }: { 
  role: string; 
  profileImg: string; 
  voiceInitData: VoiceInitResponse | null; 
}) => {
  return (
    <View style={styles.content}>
      <Pressable
        style={styles.EndButton}
        onPress={() => {
          const updatedData = {
            role: role,
            profileImg: profileImg,
            voiceInitData: voiceInitData,
          };
          router.push(
            `/(aiPage)/firstAttentionPage?data=${encodeURIComponent(
              JSON.stringify(updatedData)
            )}`
          );
        }}
      >
        <Feather name="check-circle" size={width * 0.1} color="black" />
        <Text style={styles.ButtonText}> 下一步 </Text>
      </Pressable>
    </View>
  );
};

const SkipView = ({ setStep, role, profileImg }: { setStep: (step: number) => void, role: string, profileImg: string }) => {
  const handleConfirm = async () => {
    try {
      // 获取当前用户信息
      const authManager = getAuthManager();
      const currentUser = await authManager.getCurrentUser();
      
      if (!currentUser) {
        Alert.alert('错误', '用户未登录');
        return;
      }

      const voiceConfig: VoiceSaveRequest = {
        userId: parseInt(currentUser.phone), // 使用手机号作为用户ID
        voiceId: "default", // 使用默认音色ID
        relation: role,
        originalAudioPath: "",
        simulatedAudioPath: "",
      };
      
      await getAiManager().saveVoiceConfig(voiceConfig);
      console.log("使用默认音色配置成功");
      Alert.alert('成功', 'AI角色创建成功！', [
        { text: '确定', onPress: () => router.push("/(aiPage)/firstAttentionPage") }
      ]);
    } catch (error) {
      console.error("保存默认音色配置失败:", error);
      Alert.alert('错误', '创建AI失败，请重试', [
        { text: '确定', onPress: () => router.push("/(aiPage)/firstAttentionPage") }
      ]);
    }
  };

  return (
    <View style={styles.content}>
      <Text style={styles.guideText}> 接下来将启动<Text style={{color:"red"}}>系统默认音色</Text>，确定吗？ </Text>
      <View style={styles.buttonBox}>
        <Pressable
          style={styles.normalButton}
          onPress={handleConfirm}
        >
          <Text style={styles.ButtonText}> 确定 </Text>
        </Pressable>
        <Pressable
          style={styles.normalButton}
          onPress={() => {
            setStep(2);
          }}
        >
          <Text style={styles.ButtonText}> 还是算了 </Text>
        </Pressable>
      </View>
    </View>
  );
};

const LoadingEnd = () => {
  return (
    <View style={styles.loadingBox}>
      <Text style={styles.loadingText}> 音色模仿生成成功！ </Text>
      <View
        style={[
          styles.loadingBar,
          {
            backgroundColor: "#FFB1B1",
          },
        ]}
      ></View>
    </View>
  );
};

const LoadingBar = () => {
  return (
    <View style={styles.loadingBox}>
      <Text style={styles.loadingText}> 生成音色模仿中... </Text>
      <View style={styles.loadingBar}></View>
    </View>
  );
};

export default function AiVoiceSetPage() {
  const [step, setStep] = useState<number>(0);
  const [role, setRole] = useState<string>("");
  const [profileImg, setProfileImg] = useState<string>("");
  const [voice, setVoice] = useState<string>("");
  const [voiceInitData, setVoiceInitData] = useState<VoiceInitResponse | null>(null);
  const [voiceBase64, setVoiceBase64] = useState<string>("");
  const data = useLocalSearchParams<{
    data: string;
  }>();

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(1);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (data.data) {
    //   console.log(data.data);
      const uncodeData = JSON.parse(decodeURIComponent(data.data));
      setRole(uncodeData.role);
      setProfileImg(uncodeData.image);
    }
  }, []);

  useEffect(() => {
    // console.log(voice)
    const test = async () => {
      const base64 = await audioToBase64(voice);
      setVoiceBase64(base64);
      // console.log(base64);
    }
    if (voice !== "") {
      test();
    }
  }, [voice]);

  const handleVoiceInit = (voiceData: VoiceInitResponse) => {
    setVoiceInitData(voiceData);
    // 音色初始化成功后自动进入下一步
    setStep(5);
  };

  return (
    <LinearGradient
      colors={["#FFD0D0", "#EDFFB8", "#FFFFFF", "#FFCBCB"]}
      locations={[0.1, 0.4, 0.6, 0.9]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.guideBox,
            {
              paddingTop:
                step === 3 || step === 4 || step === 5
                  ? height * 0.07
                  : height * 0.17,
            },
          ]}
        >
          {step === 4 && <LoadingBar />}
          {step === 5 && <LoadingEnd />}
          <Image
            source={guideLogo}
            style={
              step === 3 || step === 4 || step === 5
                ? styles.guideLogoStep3
                : styles.guideLogo
            }
          />
          {step === 0 && (
            <Text style={styles.guideText}> 欢迎使用牵念AI !! </Text>
          )}
          {step === 1 && <Step1 setStep={setStep} />}
          {step === 2 && <Step2 setStep={setStep} />}
          {step === 3 && <Step3 setVoice={setVoice} />}
          {step === 4 && <Step4 voiceBase64={voiceBase64} name={role} onComplete={handleVoiceInit} />}
          {step === 5 && <Step5 role={role} profileImg={profileImg} voiceInitData={voiceInitData} />}
          {step === 6 && <SkipView setStep={setStep} role={role} profileImg={profileImg} />}
        </View>
        <View style={styles.returnButton}>
          <ReturnButton />
          {step === 3 && (
            <EndButton
              onPress={() => {
                setStep(4);
              }}
            />
          )}
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
    // backgroundColor: "#FFD0D0",
    height: height,
    width: width,
  },
  guideLogo: {
    height: height * 0.25,
    width: width * 0.5,
  },
  guideLogoStep3: {
    height: height * 0.15,
    width: width * 0.3,
  },
  guideText: {
    fontSize: width * 0.07,
    // fontWeight: "bold",
    // color: "white",
  },
  guideBox: {
    flex: 1,
    // height: height * 0.2,
    width: width,
    justifyContent: "flex-start",
    // paddingTop: height * 0.17,
    alignItems: "center",
    gap: height * 0.03,
  },
  content: {
    height: height * 0.2,
    width: width,
    paddingHorizontal: width * 0.1,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: height * 0.03,
  },
  startButton: {
    height: height * 0.06,
    width: width * 0.6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFCDCD",
    borderRadius: width * 0.03,
  },
  ButtonText: {
    lineHeight: height * 0.06,
    fontSize: width * 0.07,
    // fontWeight: "bold",
  },
  buttonBox: {
    flexDirection: "row",
    height: height * 0.1,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    gap: width * 0.1,
  },
  normalButton: {
    height: height * 0.06,
    // width: width * 0.6,
    paddingHorizontal: width * 0.03,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFCDCD",
    borderRadius: width * 0.03,
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
  hintText: {
    fontSize: width * 0.04,
    // fontWeight: "bold",
    color: "#646262",
  },
  loadingBox: {
    height: height * 0.2,
    width: width * 0.8,
    justifyContent: "center",
    // alignItems: "center",
    gap: height * 0.03,
  },
  loadingBar: {
    height: height * 0.01,
    width: width * 0.8,
    backgroundColor: "#D9D9D9",
    // borderRadius: width * 0.045,
  },
  loadingText: {
    fontSize: width * 0.07,
    // fontWeight: "bold",
    color: "black",
  },
  EndButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    height: height * 0.07,
    width: width * 0.5,
    backgroundColor: "#FFD8D8",
    borderRadius: width * 0.03,
  },
  returnButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: height * 0.13,
    width: width,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "orange",
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    paddingBottom: height * 0.03,
  },
});
