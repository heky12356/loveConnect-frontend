import CircleButton from "@/components/circleButton";
import EndButton from "@/components/endButton";
import ReturnButton from "@/components/returnButton";
import Feather from "@expo/vector-icons/Feather";
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

const Step3 = () => {
  return (
    <View style={styles.content}>
      <Text style={styles.guideText}> 接下来让ta读一下下面的话吧 </Text>
      <View style={styles.judgeTextView}>
        <Text style={styles.judgeTextTitle}>妈，下午去公园晒晒太阳吧</Text>
      </View>
      <Text style={styles.hintText}>
        请尽量在安静的环境里录入，太嘈杂的环境会导致AI效果不够好哦！
      </Text>
      <CircleButton bgColor="#FFF6AF" />
    </View>
  );
};

const Step4 = ({ setStep }: { setStep: (step: number) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(5);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.content}>
      <Text style={styles.guideText}> 请耐心等待哦 ~ </Text>
    </View>
  );
};

const Step5 = () => {
  return (
    <View style={styles.content}>
      <Pressable
        style={styles.EndButton}
        onPress={() => {
          router.push("/(aiPage)/firstAttentionPage");
        }}
      >
        <Feather name="check-circle" size={width * 0.1} color="black" />
        <Text style={styles.ButtonText}> 开始使用 </Text>
      </Pressable>
    </View>
  );
};

const SkipView = ({ setStep, role }: { setStep: (step: number) => void, role: string }) => {
  return (
    <View style={styles.content}>
      <Text style={styles.guideText}> 接下来将启动<Text style={{color:"red"}}>系统默认音色</Text>，确定吗？ </Text>
      <View style={styles.buttonBox}>
        <Pressable
          style={styles.normalButton}
          onPress={() => {
            interface Data {
              name: string;
            }
            const data: Data = {
              name: role,
            }
            const params = encodeURIComponent(JSON.stringify(data));
            router.push(`/(aiPage)/aiPage?data=${params}`);
          }}
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
  const [phone, setPhone] = useState<string>("");
  const [voice, setVoice] = useState<string>("");
  const data = useLocalSearchParams<{
    data: string;
  }>();

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
      setPhone(uncodeData.phone);
    }
  }, []);

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
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 setStep={setStep} />}
          {step === 5 && <Step5 />}
          {step === 6 && <SkipView setStep={setStep} role={role} />}
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
