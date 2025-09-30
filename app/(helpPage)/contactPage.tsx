import ReturnButton from "@/components/returnButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");
const GlobalGap = width * 0.05;

export default function ContactPage() {
  const handleFAQPress = () => {
    router.push("/(helpPage)/faqPage");
  };

  const handleServicePress = () => {
    Alert.alert(
      "在线客服",
      "正在连接在线客服，请稍候...",
      [
        {
          text: "确定",
        }
      ]
    );
  };

  const handlePhonePress = (phone: string) => {
    Alert.alert(
      "拨打电话",
      `是否要拨打 ${phone}？`,
      [
        {
          text: "取消",
          style: "cancel",
        },
        {
          text: "拨打",
          onPress: () => {
            // 这里可以添加实际的拨打电话功能
            Alert.alert("提示", "正在为您拨打电话...");
          },
        },
      ]
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
          <SimpleLineIcons name="phone" size={width * 0.08} color="#FF9800" />
          <Text style={styles.mainTitle}>联系我们</Text>
        </View>

        {/* 主要内容区域 */}
        <ScrollView style={styles.contentSection} showsVerticalScrollIndicator={false}>
          <View style={styles.contactContainer}>
            {/* 官方联系方式卡片 */}
            <View style={styles.contactCard}>
              <Text style={styles.cardTitle}>官方联系方式</Text>
              <Pressable
                style={styles.contactItem}
                onPress={() => handlePhonePress("400-123-4567")}
              >
                <FontAwesome name="phone" size={width * 0.05} color="#FF9800" />
                <Text style={styles.contactText}>400-123-4567</Text>
              </Pressable>
              <Pressable
                style={styles.contactItem}
                onPress={() => {
                  Alert.alert("提示", "邮件已复制到剪贴板");
                }}
              >
                <FontAwesome name="envelope" size={width * 0.05} color="#FF9800" />
                <Text style={styles.contactText}>support@loveconnect.com</Text>
              </Pressable>
            </View>

            {/* 快捷链接 */}
            <View style={styles.quickLinkCard}>
              <Text style={styles.cardTitle}>快捷链接</Text>
              <Pressable style={styles.quickLinkButton} onPress={handleFAQPress}>
                <Text style={styles.quickLinkText}>查看常见问题</Text>
                <AntDesign name="right" size={width * 0.04} color="#666" />
              </Pressable>
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
    backgroundColor: "#FFF3E0",
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
  contactContainer: {
    backgroundColor: "#FFF3E0",
    borderRadius: width * 0.05,
    overflow: "hidden",
  },
  contactCard: {
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
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.01,
    gap: width * 0.03,
  },
  contactText: {
    fontSize: width * 0.04,
    color: "#333",
    flex: 1,
  },
  serviceCard: {
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  serviceButton: {
    backgroundColor: "#FF9800",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.02,
    borderRadius: width * 0.05,
    gap: width * 0.03,
    marginTop: height * 0.01,
  },
  serviceButtonText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "white",
  },
  workTimeCard: {
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  workTimeText: {
    fontSize: width * 0.035,
    color: "#333",
    marginBottom: height * 0.005,
  },
  workTimeNote: {
    fontSize: width * 0.03,
    color: "#666",
    fontStyle: "italic",
    marginTop: height * 0.01,
  },
  quickLinkCard: {
    padding: width * 0.04,
  },
  quickLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: width * 0.03,
  },
  quickLinkText: {
    fontSize: width * 0.035,
    color: "#333",
  },
});