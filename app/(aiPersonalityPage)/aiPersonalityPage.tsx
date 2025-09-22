import ReturnButton from "@/components/returnButton";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const guideLogo = require("@/assets/images/feedbackLogo.png");

interface Question {
  id: string;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: "mood",
    question: "您平时喜欢的心情是？",
    options: ["散步", "看电视/听戏", "养花/养宠物", "和人聊天"]
  },
  {
    id: "activities",
    question: "陪您时，您最想一起做什么？",
    options: ["聊天闲谈", "看电视/听戏", "讲过去的事情", "听取烦恼"]
  },
  {
    id: "food",
    question: "您喜欢的东西偏向哪种？",
    options: ["软乎的菜", "甜的零食", "家常菜", "都喜欢"]
  },
  {
    id: "health",
    question: "您身体有没有地方需要我多关心？",
    options: ["腰疼/腿疼", "眼睛看不清", "睡眠不好", "都还好"]
  },
  {
    id: "frequency",
    question: "您平时吃药，一般什么时候？",
    options: ["一周一次", "一周三次", "不需要", "全周"]
  }
];

export default function AiPersonalityPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [aiData, setAiData] = useState<any>(null);

  const data = useLocalSearchParams<{
    data: string;
  }>();

  useEffect(() => {
    if (data.data) {
      const decodedData = JSON.parse(decodeURIComponent(data.data));
      setAiData(decodedData);
    }
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleOptionSelect = (option: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  const handleNext = () => {
    const currentAnswer = answers[currentQuestion.id];
    if (!currentAnswer) {
      Alert.alert("提示", "请选择一个选项");
      return;
    }

    if (isLastQuestion) {
      // 完成所有问题，跳转到感谢页面
      const updatedData = {
        ...aiData,
        personalityAnswers: answers,
      };

      router.push(
        `/(aiThankYouPage)/aiThankYouPage?data=${encodeURIComponent(
          JSON.stringify(updatedData)
        )}`
      );
    } else {
      // 进入下一个问题
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getQuestionContent = () => {
    if (currentQuestionIndex === 0) {
      return (
        <View style={styles.introContainer}>
          <View style={styles.introTextContainer}>
            <Text style={styles.introText}>
              您为家里操劳了这么多年，默默付出了太多。现在我想更多了解您的想法，希望能做些让您舒心、开心的事，可又怕自己考虑不周全，没能猜对您心意。想听听您的想法，有哪些让您特别重要，谢谢您呢！
            </Text>
            <Image
              source={guideLogo}
              style={styles.introImage}
            />
          </View>
          <View style={styles.actionButtons}>
            <Pressable style={styles.actionButton} onPress={() => setCurrentQuestionIndex(1)}>
              <Text style={styles.actionButtonText}>跳过</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={() => setCurrentQuestionIndex(1)}>
              <Text style={[styles.actionButtonText, styles.primaryButtonText]}>准备好了</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.questionContainer}>        
        <View style={styles.describtion}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          <Image source={guideLogo} style={styles.questionImage} />
        </View>
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <Pressable
              key={index}
              style={[
                styles.optionButton,
                answers[currentQuestion.id] === option && styles.selectedOption
              ]}
              onPress={() => handleOptionSelect(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioButton,
                    answers[currentQuestion.id] === option && styles.selectedRadio,
                  ]}
                >
                  {answers[currentQuestion.id] === option && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"]}
      locations={[0.1, 0.4, 0.6, 0.9]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {getQuestionContent()}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <ReturnButton />
        {currentQuestionIndex > 0 && (
          <View style={styles.navigationButtons}>
            {currentQuestionIndex > 1 && (
              <Pressable style={styles.navButton} onPress={handlePrevious}>
                <Text style={styles.navButtonText}>上一题</Text>
              </Pressable>
            )}
            <Pressable 
              style={[styles.navButton, styles.nextButton]} 
              onPress={handleNext}
            >
              <Text style={[styles.navButtonText, styles.nextButtonText]}>
                {isLastQuestion ? "完成" : "下一步"}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: height * 0.05,
    paddingHorizontal: width * 0.05,
    minHeight: height * 0.8,
  },
  introContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  introTextContainer: {
    width: "100%",
    marginBottom: height * 0.04,
    backgroundColor: "#FFCBCB",
    padding: width * 0.05,
    borderRadius: width * 0.03,
  },
  introText: {
    fontSize: width * 0.07,
    // lineHeight: width * 0.06,
    color: "#333",
    textAlign: "center",
  },
  introImage: {
    width: width * 0.25,
    height: width * 0.25,
    resizeMode: "contain",
    alignSelf: "flex-end",
  },
  avatarContainer: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.03,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: width * 0.06,
  },
  actionButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    // gap: width * 0.05,
  },
  actionButton: {
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.015,
    backgroundColor: "#FFCDCD",
    borderRadius: width * 0.03,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  primaryButton: {
    backgroundColor: "#FFCDCD",
    borderColor: "#FFB6C1",
  },
  actionButtonText: {
    fontSize: width * 0.055,
    color: "#333",
  },
  primaryButtonText: {
    color: "#333",
  },
  questionContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: height * 0.05,

    display: "flex",
    gap: height * 0.03,
  },
  describtion: {
    width: "90%",
    padding: width * 0.05,
    backgroundColor: "#FFE9E9",
    borderRadius: width * 0.05,

    display: "flex",
  },
  questionImage: {
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: "contain",
    alignSelf: "flex-end",
  },
  questionText: {
    fontSize: width * 0.06,
    color: "#333",
    textAlign: "left",
    fontWeight: "500",
    paddingHorizontal: width * 0.05,
  },
  optionsContainer: {
    width: "100%",
    paddingHorizontal: width * 0.05,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.015,
    borderRadius: width * 0.03,
    // borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedOption: {
    // backgroundColor: "#FFE4E1",
    borderColor: "#FFB6C1",
  },
  selectedRadio: {
    // borderColor: "#FFB6C1",
    // backgroundColor: "#FFB6C1",
  },
  optionText: {
    fontSize: width * 0.06,
    color: "#333",
    flex: 1,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.03,
    paddingTop: height * 0.02,
  },
  navigationButtons: {
    flexDirection: "row",
    gap: width * 0.03,
  },
  navButton: {
    width: width * 0.3,
    height: height * 0.07,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: width * 0.03,
    borderWidth: 1,
    borderColor: "#ddd",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#A7BAFF",
    // borderColor: "#87CEEB",
  },
  navButtonText: {
    fontSize: width * 0.04,
    color: "#666",
  },
  nextButtonText: {
    color: "#333",
    fontSize: width * 0.07,
    lineHeight: width * 0.07,
  },
  radioContainer: {
    padding: width * 0.01,
  },
  radioButton: {
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.04,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5,
  },
  radioButtonSelected: {
    borderColor: "#333",
  },
  radioButtonInner: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: width * 0.05,
    backgroundColor: "#FEADB4",
  },
});