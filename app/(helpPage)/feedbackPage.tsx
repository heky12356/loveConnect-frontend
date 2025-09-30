import ReturnButton from "@/components/returnButton";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");
const GlobalGap = width * 0.05;

// 反馈类型选项
const feedbackTypes = [
  { id: "bug", label: "功能问题", color: "#F44336" },
  { id: "suggestion", label: "改进建议", color: "#2196F3" },
  { id: "praise", label: "表扬鼓励", color: "#4CAF50" },
  { id: "other", label: "其他", color: "#FF9800" },
];

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = () => {
    // 表单验证
    if (!feedbackType) {
      Alert.alert("提示", "请选择反馈类型");
      return;
    }

    if (!description.trim()) {
      Alert.alert("提示", "请描述您的意见或建议");
      return;
    }

    if (description.trim().length < 10) {
      Alert.alert("提示", "请详细描述您的意见（至少10个字符）");
      return;
    }

    // 模拟提交过程
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      // 显示成功提示
      Alert.alert(
        "提交成功",
        "感谢您的反馈！我们会认真考虑您的意见，不断改进产品体验。",
        [
          {
            text: "确定",
            onPress: () => {
              // 重置表单
              setFeedbackType("");
              setDescription("");
              setContact("");
            }
          }
        ]
      );
    }, 2000);
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
          <Entypo name="edit" size={width * 0.08} color="#2196F3" />
          <Text style={styles.mainTitle}>意见反馈</Text>
        </View>

        {/* 反馈表单区域 */}
        <ScrollView style={styles.contentSection} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {/* 反馈类型选择 */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>反馈类型</Text>
              <View style={styles.typeContainer}>
                {feedbackTypes.map((type) => (
                  <Pressable
                    key={type.id}
                    style={[
                      styles.typeButton,
                      {
                        backgroundColor: feedbackType === type.id ? type.color : "#F5F5F5",
                        borderColor: type.color,
                      }
                    ]}
                    onPress={() => setFeedbackType(type.id)}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        { color: feedbackType === type.id ? "white" : type.color }
                      ]}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* 问题描述 */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>问题描述</Text>
              <Text style={styles.description}>
                请详细描述您遇到的问题、建议或想法，这将帮助我们更好地改进产品。
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="请详细描述您的意见或建议（至少10个字符）..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
                maxLength={500}
              />
              <Text style={styles.charCount}>
                {description.length}/500
              </Text>
            </View>

            {/* 联系方式 */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>联系方式（可选）</Text>
              <Text style={styles.description}>
                如果您需要我们回复，请留下您的联系方式（手机号或邮箱）。
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="请输入手机号或邮箱地址..."
                placeholderTextColor="#999"
                value={contact}
                onChangeText={setContact}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* 温馨提示 */}
            <View style={styles.tipSection}>
              <View style={styles.tipHeader}>
                <Entypo name="info" size={width * 0.05} color="#2196F3" />
                <Text style={styles.tipTitle}>温馨提示</Text>
              </View>
              <Text style={styles.tipContent}>
                • 我们会认真阅读每一条反馈意见{"\n"}
                • 有价值的功能建议我们会在后续版本中考虑实现{"\n"}
                • 提交问题反馈时，请尽量详细描述复现步骤{"\n"}
                • 您的个人信息我们将严格保密
              </Text>
            </View>

            {/* 提交按钮 */}
            <Pressable
              style={[
                styles.submitButton,
                {
                  backgroundColor: isSubmitting ? "#CCC" : "#2196F3",
                }
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Text style={styles.submitButtonText}>提交中...</Text>
              ) : (
                <Text style={styles.submitButtonText}>提交反馈</Text>
              )}
            </Pressable>
          </View>
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
    backgroundColor: "#E3F2FD",
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
  formContainer: {
    backgroundColor: "#E3F2FD",
    borderRadius: width * 0.05,
    overflow: "hidden",
  },
  formSection: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.01,
  },
  description: {
    fontSize: width * 0.03,
    color: "#666",
    marginBottom: height * 0.015,
    lineHeight: height * 0.04,
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: width * 0.02,
  },
  typeButton: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    borderRadius: width * 0.03,
    borderWidth: 1,
    backgroundColor: "#F5F5F5",
  },
  typeButtonText: {
    fontSize: width * 0.03,
    fontWeight: "500",
  },
  textInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.015,
    fontSize: width * 0.04,
    color: "#333",
    textAlignVertical: "top",
    minHeight: height * 0.12,
  },
  charCount: {
    fontSize: width * 0.025,
    color: "#999",
    textAlign: "right",
    marginTop: height * 0.005,
  },
  tipSection: {
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    margin: width * 0.04,
    padding: width * 0.03,
    borderRadius: width * 0.03,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.02,
    marginBottom: height * 0.01,
  },
  tipTitle: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: "#2196F3",
  },
  tipContent: {
    fontSize: width * 0.025,
    color: "#555",
    lineHeight: height * 0.035,
  },
  submitButton: {
    margin: width * 0.04,
    paddingVertical: height * 0.02,
    borderRadius: width * 0.05,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "white",
  },
  bottomReturn: {
    position: "absolute",
    bottom: height * 0.05,
    left: width * 0.05,
    zIndex: 10,
  },
});