import ReturnButton from "@/components/returnButton";
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");
const feedBackLogo = require('@/assets/images/feedbackLogo.png')
const iconSize = width * 0.08
export default function FeedbackPage() {
  return (
    <LinearGradient
      colors={["#FFD0D0", "#EDFFB8", "#FFFFFF", "#FFCBCB"]}
      locations={[0.1, 0.4, 0.5, 0.9]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
      }}
    >
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>感谢 ！！</Text>
      </View>
      <View style={styles.logoView}>
        <Image source={feedBackLogo} style={styles.logo} />
      </View>
      <View style={styles.content}>
        <View style={styles.contentView}>
          <Text style={styles.contentText}>
            孩子已收到您的反馈！！
          </Text>
          <AntDesign name="sound" size={iconSize} color="black" style={styles.contentTail} />
        </View>
      </View>
      <View style={styles.returnButton}>
        <ReturnButton path="/(aiListPage)/aiListPage"/>
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
    justifyContent: "center",
    alignItems: "center",
  },
  titleView: {
    paddingTop: height * 0.07,
    height: height * 0.17,
    width: width,
    // justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "blue",
  },
  titleText: {
    fontSize: width * 0.1,
    fontWeight: "bold",
  },
  logoView: {
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.3,
    width: width,
    // backgroundColor: "red",
  },
  logo: {
    height: height * 0.27,
    width: width * 0.5,
  },
  content: {
    paddingTop: height * 0.02,
    height: height * 0.4,
    width: width,
    alignItems: "center",
    // backgroundColor: "green",
  },
  contentView: {
    position: "relative",
    height: height * 0.13,
    width: width * 0.8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFCBCB",
    borderRadius: width * 0.05,
    paddingLeft: width * 0.08,
    paddingRight: width * 0.02,
  },
  contentText: {
    fontSize: width * 0.08,
    // backgroundColor: "purple"
  },
  contentTail: {
    position: "absolute",
    right: width * 0.08,
    top: height * 0.08,
    zIndex: 10,
  },
  returnButton: {
    height: height * 0.13,
    width: width,
    justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "orange",
    paddingLeft: width * 0.05,
    paddingBottom: height * 0.03,
  },
});
