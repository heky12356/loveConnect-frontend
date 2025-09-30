import ReturnButton from "@/components/returnButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");
const GlobalGap = width * 0.05;

// 帮助卡片组件
const HelpCard = ({
  icon,
  title,
  subtitle,
  backgroundColor = "#FFE4E6",
  onPress
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  backgroundColor?: string;
  onPress?: () => void;
}) => {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <Pressable
      style={[
        styles.helpCard,
        { backgroundColor },
        isPressed && styles.cardPressed
      ]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
    >
      <View style={styles.cardIconContainer}>
        {icon}
      </View>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.cardArrowContainer}>
        <AntDesign name="right" size={width * 0.05} color="#666" />
      </View>
    </Pressable>
  );
};

export default function HelpPage() {
  // 页面跳转函数
  const handleFAQPress = () => router.push("/(helpPage)/faqPage");
  const handleGuidePress = () => router.push("/(helpPage)/guidePage");
  const handleFeedbackPress = () => router.push("/(helpPage)/feedbackPage");
  const handleContactPress = () => router.push("/(helpPage)/contactPage");
  const handleVersionPress = () => router.push("/(helpPage)/versionPage");
  const handleUpdatePress = () => router.push("/(helpPage)/updatePage");

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
        {/* 页面标题区域 - 简化，去掉返回按钮 */}
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>问题反馈与帮助中心</Text>
          <View style={styles.titleUnderline} />
        </View>

        {/* 主要内容区域 */}
        <View style={styles.contentSection}>
          {/* 第一行：常见问题、使用指南 */}
          <View style={styles.rowContainer}>
            <HelpCard
              icon={<MaterialIcons name="help-outline" size={width * 0.08} color="#FF6E6E" />}
              title="常见问题"
              subtitle="查看使用中常见问题解答"
              backgroundColor="#FFE4E6"
              onPress={handleFAQPress}
            />
            <HelpCard
              icon={<FontAwesome name="book" size={width * 0.08} color="#4CAF50" />}
              title="使用指南"
              subtitle="学习如何使用各项功能"
              backgroundColor="#E8F5E8"
              onPress={handleGuidePress}
            />
          </View>

          {/* 第二行：意见反馈、联系我们 */}
          <View style={styles.rowContainer}>
            <HelpCard
              icon={<Entypo name="edit" size={width * 0.08} color="#2196F3" />}
              title="意见反馈"
              subtitle="告诉我们您的想法和建议"
              backgroundColor="#E3F2FD"
              onPress={handleFeedbackPress}
            />
            <HelpCard
              icon={<SimpleLineIcons name="phone" size={width * 0.08} color="#FF9800" />}
              title="联系我们"
              subtitle="获取官方技术支持"
              backgroundColor="#FFF3E0"
              onPress={handleContactPress}
            />
          </View>

          {/* 第三行：版本信息、检查更新 */}
          <View style={styles.rowContainer}>
            <HelpCard
              icon={<AntDesign name="infocirlceo" size={width * 0.08} color="#9C27B0" />}
              title="版本信息"
              subtitle="查看当前版本和更新日志"
              backgroundColor="#F3E5F5"
              onPress={handleVersionPress}
            />
            <HelpCard
              icon={<Foundation name="refresh" size={width * 0.08} color="#607D8B" />}
              title="检查更新"
              subtitle="检查是否有新版本可用"
              backgroundColor="#ECEFF1"
              onPress={handleUpdatePress}
            />
          </View>
        </View>

        {/* 底部返回按钮区域 */}
        <View style={styles.bottomReturn}>
          <ReturnButton />
        </View>

        {/* 底部装饰区域 */}
        <View style={styles.footerSection}>
          <Image
            source={require("@/assets/images/feedbackLogo.png")}
            style={styles.footerLogo}
          />
          <Text style={styles.footerText}>我们致力于为您提供更好的服务体验</Text>
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
    alignItems: "center",
    justifyContent: "center",
    width: width,
    paddingHorizontal: GlobalGap,
    paddingTop: height * 0.05,
    paddingBottom: height * 0.03,
    backgroundColor: "#FFE4E6",
  },
  mainTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  titleUnderline: {
    height: 2,
    backgroundColor: "#FF6E6E",
    width: width * 0.4,
    alignSelf: "center",
    marginTop: height * 0.01,
    borderRadius: 1,
  },
  bottomReturn: {
    position: "absolute",
    bottom: height * 0.05,
    left: width * 0.05,
    zIndex: 10,
  },
  contentSection: {
    flex: 1,
    width: width,
    paddingHorizontal: GlobalGap,
    paddingVertical: height * 0.03,
    justifyContent: "center",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
    width: width * 0.9,
    gap: width * 0.03,
  },
  helpCard: {
    width: width * 0.42,
    height: height * 0.18,
    borderRadius: width * 0.05,
    padding: width * 0.04,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardIconContainer: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: width * 0.03,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.005,
  },
  cardSubtitle: {
    fontSize: width * 0.025,
    color: "#666",
    lineHeight: height * 0.03,
  },
  cardArrowContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  footerSection: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: height * 0.05,
    paddingHorizontal: GlobalGap,
  },
  footerLogo: {
    width: width * 0.15,
    height: width * 0.15,
    marginBottom: height * 0.01,
    opacity: 0.8,
  },
  footerText: {
    fontSize: width * 0.03,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
});