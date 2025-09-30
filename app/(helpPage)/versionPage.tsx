import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ReturnButton from "@/components/returnButton";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";

const { height, width } = Dimensions.get("window");
const GlobalGap = width * 0.05;

export default function VersionPage() {
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
          <AntDesign name="infocirlceo" size={width * 0.08} color="#9C27B0" />
          <Text style={styles.mainTitle}>版本信息</Text>
        </View>

        {/* 主要内容区域 */}
        <ScrollView style={styles.contentSection} showsVerticalScrollIndicator={false}>
          <View style={styles.versionContainer}>
            {/* 当前版本信息 */}
            <View style={styles.currentVersionCard}>
              <Text style={styles.cardTitle}>当前版本</Text>
              <View style={styles.versionInfo}>
                <Text style={styles.versionNumber}>v1.0.0</Text>
                <Text style={styles.updateDate}>更新时间：2024年9月30日</Text>
              </View>
            </View>

            {/* 功能特性 */}
            <View style={styles.featuresCard}>
              <Text style={styles.cardTitle}>功能特性</Text>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <MaterialIcons name="favorite" size={width * 0.05} color="#9C27B0" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>心情记录</Text>
                  <Text style={styles.featureDesc}>记录每天的心情变化，关注情绪健康</Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <MaterialIcons name="psychology" size={width * 0.05} color="#9C27B0" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>AI问答</Text>
                  <Text style={styles.featureDesc}>智能助手为您提供专业建议和支持</Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <MaterialIcons name="schedule" size={width * 0.05} color="#9C27B0" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>定时设置</Text>
                  <Text style={styles.featureDesc}>自定义提醒时间，不错过重要事项</Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <MaterialIcons name="phone-in-talk" size={width * 0.05} color="#9C27B0" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>紧急联系</Text>
                  <Text style={styles.featureDesc}>一键呼出紧急联系人，保障安全</Text>
                </View>
              </View>
            </View>

            {/* 更新日志 */}
            <View style={styles.changelogCard}>
              <Text style={styles.cardTitle}>更新日志</Text>
              <View style={styles.changelogItem}>
                <Text style={styles.changelogVersion}>v1.0.0</Text>
                <Text style={styles.changelogDate}>2024年9月30日</Text>
                <Text style={styles.changelogContent}>• ✨ 初始版本发布</Text>
                <Text style={styles.changelogContent}>• 🎉 支持心情记录、AI问答、定时设置、紧急联系等核心功能</Text>
                <Text style={styles.changelogContent}>• 🛠️ 完善用户注册登录流程</Text>
                <Text style={styles.changelogContent}>• 💖 优化用户体验和界面设计</Text>
              </View>
            </View>
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
    backgroundColor: "#F3E5F5",
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
  bottomReturn: {
    position: "absolute",
    bottom: height * 0.05,
    left: width * 0.05,
    zIndex: 10,
  },
  versionContainer: {
    backgroundColor: "#F3E5F5",
    borderRadius: width * 0.05,
    overflow: "hidden",
  },
  currentVersionCard: {
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  cardTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.02,
  },
  versionInfo: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: width * 0.04,
    borderRadius: width * 0.03,
    alignItems: "center",
  },
  versionNumber: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#9C27B0",
    marginBottom: height * 0.01,
  },
  updateDate: {
    fontSize: width * 0.035,
    color: "#666",
  },
  featuresCard: {
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: width * 0.03,
    borderRadius: width * 0.03,
    marginBottom: height * 0.01,
  },
  featureIcon: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: "rgba(156, 39, 176, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.03,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.005,
  },
  featureDesc: {
    fontSize: width * 0.03,
    color: "#666",
    lineHeight: height * 0.04,
  },
  changelogCard: {
    padding: width * 0.04,
  },
  changelogItem: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: width * 0.04,
    borderRadius: width * 0.03,
  },
  changelogVersion: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#9C27B0",
    marginBottom: height * 0.005,
  },
  changelogDate: {
    fontSize: width * 0.03,
    color: "#666",
    marginBottom: height * 0.01,
    fontStyle: "italic",
  },
  changelogContent: {
    fontSize: width * 0.03,
    color: "#333",
    lineHeight: height * 0.04,
    marginBottom: height * 0.002,
  },
});