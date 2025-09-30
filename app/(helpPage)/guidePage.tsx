import ReturnButton from "@/components/returnButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

const { height, width } = Dimensions.get("window");
const GlobalGap = width * 0.05;

// 使用指南数据
const guideData = [
  {
    section: "快速入门",
    steps: [
      {
        step: "步骤 1",
        title: "注册/登录账号",
        description: "如果您是新用户，请先注册账号。如果您已有账号，直接登录即可。",
        tips: "首次登录建议完善个人信息，获得更好的使用体验。"
      },
      {
        step: "步骤 2",
        title: "了解主界面",
        description: "主界面包含心情记录、AI问答、消息通知、紧急联系等主要功能入口。",
        tips: "功能卡片采用不同颜色区分，便于快速识别。"
      },
      {
        step: "步骤 3",
        title: "记录心情",
        description: "每天抽时间记录当前心情，帮助您更好地了解自己的情绪变化。",
        tips: "心情记录仅保存在本地，保护您的隐私安全。"
      }
    ]
  },
  {
    section: "核心功能使用",
    steps: [
      {
        step: "AI问答",
        title: "智能助手",
        description: "点击\"有问题，问AI\"卡片，可以与AI助手进行对话，获取建议和支持。",
        tips: "AI助手可以回答各种问题，包括生活、学习、工作等方面。"
      },
      {
        step: "定时设置",
        title: "提醒功能",
        description: "点击\"定时设置\"可以设置定时提醒，不会错过重要的事情。",
        tips: "可以设置多个定时任务，系统会准时发送通知提醒。"
      },
      {
        step: "一键呼出",
        title: "紧急联系",
        description: "在紧急情况下，点击\"一键呼出\"可以快速联系紧急联系人。",
        tips: "请提前在个人资料中设置好紧急联系人电话号码。"
      }
    ]
  },
  {
    section: "个人中心",
    steps: [
      {
        step: "个人信息",
        title: "资料管理",
        description: "点击头像进入个人资料页面，可以修改姓名、性别、生日、地址等信息。",
        tips: "完整的个人信息有助于系统更好地为您提供服务。"
      },
      {
        step: "消息中心",
        title: "消息管理",
        description: "点击\"消息通知\"查看系统消息和通知，及时了解重要信息。",
        tips: "未读消息会显示红色数字标记，记得及时查看。"
      },
      {
        step: "帮助中心",
        title: "获取帮助",
        description: "点击\"有问题点这里\"进入帮助中心，查看常见问题和使用指南。",
        tips: "如果遇到问题，可以先在帮助中心寻找解决方案。"
      }
    ]
  },
  {
    section: "进阶技巧",
    steps: [
      {
        step: "个性化设置",
        title: "定制体验",
        description: "根据个人喜好设置心情记录频率、提醒方式等，打造专属的使用体验。",
        tips: "定期检查并更新设置，确保符合当前需求。"
      },
      {
        step: "数据管理",
        title: "信息维护",
        description: "定期备份重要数据，清理无用信息，保持应用运行流畅。",
        tips: "建议每月检查一次个人信息和数据状态。"
      },
      {
        step: "安全建议",
        title: "账户安全",
        description: "定期更换密码，不要在公共设备上保存登录信息，保护账户安全。",
        tips: "如果发现异常情况，请立即联系客服或修改密码。"
      }
    ]
  }
];

// 指南项目组件
const GuideItem = ({ step, title, description, tips }: {
  step: string;
  title: string;
  description: string;
  tips: string;
}) => {
  return (
    <View style={styles.guideItem}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepText}>{step}</Text>
        <Text style={styles.stepTitle}>{title}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepDescription}>{description}</Text>
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsLabel}>💡 小贴士：</Text>
          <Text style={styles.tipsText}>{tips}</Text>
        </View>
      </View>
    </View>
  );
};

// 指南分类组件
const GuideSection = ({ section, steps }: {
  section: string;
  steps: typeof guideData[0]["steps"];
}) => {
  return (
    <View style={styles.guideSection}>
      <Text style={styles.sectionTitle}>{section}</Text>
      <View style={styles.sectionContainer}>
        {steps.map((item, index) => (
          <GuideItem
            key={`${section}-${index}`}
            step={item.step}
            title={item.title}
            description={item.description}
            tips={item.tips}
          />
        ))}
      </View>
    </View>
  );
};

export default function GuidePage() {
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
          <FontAwesome name="book" size={width * 0.08} color="#4CAF50" />
          <Text style={styles.mainTitle}>使用指南</Text>
        </View>

        {/* 指南内容区域 */}
        <ScrollView style={styles.contentSection} showsVerticalScrollIndicator={false}>
          {guideData.map((category, index) => (
            <GuideSection
              key={index}
              section={category.section}
              steps={category.steps}
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
    backgroundColor: "#E8F5E8",
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
  guideSection: {
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.01,
    backgroundColor: "#4CAF50",
    borderRadius: width * 0.03,
    textAlign: "center",
  },
  sectionContainer: {
    backgroundColor: "#E8F5E8",
    borderRadius: width * 0.05,
    overflow: "hidden",
  },
  guideItem: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    gap: width * 0.03,
  },
  stepText: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: "#4CAF50",
    backgroundColor: "white",
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.005,
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  stepTitle: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  stepContent: {
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  stepDescription: {
    fontSize: width * 0.035,
    color: "#333",
    lineHeight: height * 0.05,
    marginBottom: height * 0.01,
  },
  tipsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    padding: width * 0.02,
    borderRadius: width * 0.02,
  },
  tipsLabel: {
    fontSize: width * 0.03,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  tipsText: {
    fontSize: width * 0.03,
    color: "#555",
    flex: 1,
    lineHeight: height * 0.04,
  },
  bottomReturn: {
    position: "absolute",
    bottom: height * 0.05,
    left: width * 0.05,
    zIndex: 10,
  },
});