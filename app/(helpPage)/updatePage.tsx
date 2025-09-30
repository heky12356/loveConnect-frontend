import { LinearGradient } from "expo-linear-gradient";
import Foundation from "@expo/vector-icons/Foundation";
import AntDesign from "@expo/vector-icons/AntDesign";
import ReturnButton from "@/components/returnButton";
import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
} from "react-native";

const { height, width } = Dimensions.get("window");
const GlobalGap = width * 0.05;

export default function UpdatePage() {
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const handleCheckUpdate = () => {
    setIsChecking(true);

    // 模拟检查更新过程
    setTimeout(() => {
      setIsChecking(false);

      // 显示检查结果
      Alert.alert(
        "检查完成",
        "您的应用已是最新版本！",
        [
          {
            text: "确定",
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
          <Foundation name="refresh" size={width * 0.08} color="#607D8B" />
          <Text style={styles.mainTitle}>检查更新</Text>
        </View>

        {/* 主要内容区域 */}
        <ScrollView style={styles.contentSection} showsVerticalScrollIndicator={false}>
          <View style={styles.updateContainer}>
            {/* 版本状态 */}
            <View style={styles.statusCard}>
              <Text style={styles.cardTitle}>版本状态</Text>
              <View style={styles.statusContent}>
                <View style={styles.statusIcon}>
                  <AntDesign name="checkcircle" size={width * 0.1} color="#4CAF50" />
                </View>
                <Text style={styles.statusText}>您的应用已是最新版本</Text>
                <Text style={styles.currentVersionText}>当前版本：v1.0.0</Text>
              </View>
            </View>

            {/* 检查更新按钮 */}
            <Pressable
              style={[styles.checkButton, isChecking && styles.checkButtonDisabled]}
              onPress={handleCheckUpdate}
              disabled={isChecking}
            >
              {isChecking ? (
                <>
                  <AntDesign name="loading1" size={width * 0.06} color="white" />
                  <Text style={styles.checkButtonText}>检查中...</Text>
                </>
              ) : (
                <>
                  <Foundation name="refresh" size={width * 0.06} color="white" />
                  <Text style={styles.checkButtonText}>重新检查</Text>
                </>
              )}
            </Pressable>

            {/* 更新说明 */}
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>更新说明</Text>
              <Text style={styles.infoContent}>• 应用会定期检查新版本，您也可以手动检查更新</Text>
              <Text style={styles.infoContent}>• 发现新版本时，系统会提示您下载安装</Text>
              <Text style={styles.infoContent}>• 建议在WiFi环境下进行版本更新</Text>
              <Text style={styles.infoContent}>• 更新过程中请保持网络连接稳定</Text>
            </View>

            {/* 注意事项 */}
            <View style={styles.noticeCard}>
              <Text style={styles.cardTitle}>注意事项</Text>
              <View style={styles.noticeItem}>
                <Text style={styles.noticeIcon}>⚠️</Text>
                <Text style={styles.noticeText}>更新前请备份重要数据</Text>
              </View>
              <View style={styles.noticeItem}>
                <Text style={styles.noticeIcon}>💾</Text>
                <Text style={styles.noticeText}>确保设备有足够存储空间</Text>
              </View>
              <View style={styles.noticeItem}>
                <Text style={styles.noticeIcon}>🔋</Text>
                <Text style={styles.noticeText}>建议在电量充足时更新</Text>
              </View>
              <View style={styles.noticeItem}>
                <Text style={styles.noticeIcon}>📶</Text>
                <Text style={styles.noticeText}>更新过程中请勿关闭网络</Text>
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
    backgroundColor: "#ECEFF1",
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
  updateContainer: {
    backgroundColor: "#ECEFF1",
    borderRadius: width * 0.05,
    overflow: "hidden",
  },
  statusCard: {
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
  statusContent: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: width * 0.04,
    borderRadius: width * 0.03,
    alignItems: "center",
  },
  statusIcon: {
    marginBottom: height * 0.02,
  },
  statusText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: height * 0.01,
    textAlign: "center",
  },
  currentVersionText: {
    fontSize: width * 0.035,
    color: "#666",
    textAlign: "center",
  },
  checkButton: {
    margin: width * 0.04,
    backgroundColor: "#607D8B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.02,
    borderRadius: width * 0.05,
    gap: width * 0.03,
  },
  checkButtonDisabled: {
    backgroundColor: "#B0BEC5",
  },
  checkButtonText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "white",
  },
  infoCard: {
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  infoContent: {
    fontSize: width * 0.03,
    color: "#333",
    lineHeight: height * 0.04,
    marginBottom: height * 0.002,
  },
  noticeCard: {
    padding: width * 0.04,
  },
  noticeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: width * 0.03,
    borderRadius: width * 0.03,
    marginBottom: height * 0.01,
    gap: width * 0.03,
  },
  noticeIcon: {
    fontSize: width * 0.04,
    width: width * 0.06,
    textAlign: "center",
  },
  noticeText: {
    fontSize: width * 0.03,
    color: "#333",
    flex: 1,
    lineHeight: height * 0.04,
  },
});