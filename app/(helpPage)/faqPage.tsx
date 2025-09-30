import ReturnButton from "@/components/returnButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");
const GlobalGap = width * 0.05;

// FAQ数据
const faqData = [
  {
    category: "使用问题",
    questions: [
      {
        question: "如何修改个人信息？",
        answer: "1. 在主页点击右上角头像进入个人资料页面\n2. 点击要修改的信息项（如姓名、性别、生日等）\n3. 在对应的编辑页面中修改信息\n4. 点击确定保存修改"
      },
      {
        question: "定时设置如何使用？",
        answer: "1. 在主页底部点击\"定时设置\"按钮\n2. 设置定时提醒的时间和内容\n3. 开启定时功能\n4. 系统会在设定时间发送提醒通知"
      },
      {
        question: "如何上传头像？",
        answer: "1. 进入个人资料页面\n2. 点击头像或相机图标\n3. 从相册选择或拍摄照片\n4. 确认上传，头像会自动更新"
      }
    ]
  },
  {
    category: "账号问题",
    questions: [
      {
        question: "忘记密码怎么办？",
        answer: "1. 在登录页面点击\"忘记密码\"\n2. 输入注册时使用的手机号\n3. 系统会发送验证码到您的手机\n4. 输入验证码后可重置密码"
      },
      {
        question: "如何注册账号？",
        answer: "1. 打开应用，在登录页面点击\"注册\"\n2. 填写手机号、密码、确认密码\n3. 填写姓名并完成注册\n4. 注册成功后自动登录"
      }
    ]
  },
  {
    category: "功能问题",
    questions: [
      {
        question: "AI问答功能如何使用？",
        answer: "1. 在主页点击\"有问题，问AI\"卡片\n2. 进入AI对话页面\n3. 输入您想问的问题\n4. AI会给出相应的回答和建议"
      },
      {
        question: "心情记录有什么作用？",
        answer: "1. 心情记录帮助您关注自己的情绪变化\n2. 系统会根据您的情绪状态提供相应的建议\n3. 长期记录有助于了解自己的情绪模式\n4. 数据仅保存在本地，保护您的隐私"
      },
      {
        question: "紧急联系功能如何设置？",
        answer: "1. 在个人资料页面设置紧急联系人电话\n2. 遇到紧急情况时点击主页的\"一键呼出\"按钮\n3. 系统会自动拨打设置的电话号码\n4. 请确保设置的号码是可用的紧急联系人"
      }
    ]
  }
];

// FAQ项目组件
const FAQItem = ({ question, answer, isExpanded, onPress }: {
  question: string;
  answer: string;
  isExpanded: boolean;
  onPress: () => void;
}) => {
  return (
    <View style={styles.faqItem}>
      <Pressable style={styles.faqQuestion} onPress={onPress}>
        <Text style={styles.faqQuestionText}>{question}</Text>
        <AntDesign
          name={isExpanded ? "up" : "down"}
          size={width * 0.04}
          color="#666"
        />
      </Pressable>
      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

// FAQ分类组件
const FAQCategory = ({ category, questions, expandedItems, onToggle }: {
  category: string;
  questions: typeof faqData[0]["questions"];
  expandedItems: string[];
  onToggle: (question: string) => void;
}) => {
  return (
    <View style={styles.faqCategory}>
      <Text style={styles.categoryTitle}>{category}</Text>
      <View style={styles.categoryContainer}>
        {questions.map((item, index) => (
          <FAQItem
            key={`${category}-${index}`}
            question={item.question}
            answer={item.answer}
            isExpanded={expandedItems.includes(item.question)}
            onPress={() => onToggle(item.question)}
          />
        ))}
      </View>
    </View>
  );
};

export default function FAQPage() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleToggle = (question: string) => {
    setExpandedItems(prev =>
      prev.includes(question)
        ? prev.filter(item => item !== question)
        : [...prev, question]
    );
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#FFFFFF", "#FFFFFF"]}
      locations={[0.1, 0.4, 0.7]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        {/* 页面标题区域 */}
        <View style={styles.headerSection}>
          <MaterialIcons name="help-outline" size={width * 0.08} color="#FF6E6E" />
          <Text style={styles.mainTitle}>常见问题</Text>
        </View>

        {/* 问题列表区域 */}
        <ScrollView style={styles.contentSection} showsVerticalScrollIndicator={false}>
          {faqData.map((category, index) => (
            <FAQCategory
              key={index}
              category={category.category}
              questions={category.questions}
              expandedItems={expandedItems}
              onToggle={handleToggle}
            />
          ))}
        </ScrollView>

        {/* 底部返回按钮区域 */}
        <View style={styles.bottomReturn}>
          <ReturnButton />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    width: width,
    alignItems: "center",
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width,
    paddingHorizontal: GlobalGap,
    paddingTop: height * 0.05,
    paddingBottom: height * 0.03,
    backgroundColor: "#FFE4E6",
    gap: width * 0.03,
  },
  mainTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  contentSection: {
    flex: 1,
    width: width * 0.9,
    paddingHorizontal: GlobalGap,
    paddingVertical: height * 0.02,
  },
  faqCategory: {
    marginBottom: height * 0.02,
  },
  categoryTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.01,
  },
  categoryContainer: {
    backgroundColor: "#FFE4E6",
    borderRadius: width * 0.05,
    overflow: "hidden",
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  faqQuestionText: {
    fontSize: width * 0.04,
    color: "#333",
    flex: 1,
    paddingRight: width * 0.02,
    lineHeight: height * 0.05,
  },
  faqAnswer: {
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  faqAnswerText: {
    fontSize: width * 0.035,
    color: "#666",
    lineHeight: height * 0.05,
  },
  bottomReturn: {
    position: "absolute",
    bottom: height * 0.05,
    left: width * 0.05,
    zIndex: 10,
  },
});