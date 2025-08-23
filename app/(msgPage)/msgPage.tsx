import AiListItem from "@/components/aiListItem";
import ReturnButton from "@/components/returnButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");
const GlobalFontSize = width * 0.3;
const exampleImg = require("@/assets/images/profile.png");

export default function MsgPage() {
  return (
    <LinearGradient
      colors={["#FFD0D0", "#EDFFB8", "#FFFFFF", "#FFCBCB"]}
      locations={[0.08, 0.4, 0.6, 0.9]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons
            name="message-outline"
            size={GlobalFontSize}
            color="black"
          />
          <Text style={styles.logoText}>消息通知</Text>
        </View>
        <View style={styles.content}>
          <AiListItem name="女儿" img={exampleImg} postNum={11} />
          <AiListItem name="儿子" />
          <AiListItem name="儿媳妇" />
          <Pressable
            style={styles.timeSetLink}
            onPress={() => {
              router.push("/(msgPage)/timeSet");
            }}
          >
            <Text style={styles.timeSetLinkText}>更改时间设置</Text>
            <AntDesign name="right" size={width * 0.07} color="black" />
          </Pressable>
        </View>
        <View style={styles.returnButton}>
          <ReturnButton />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  logoContainer: {
    paddingTop: height * 0.03,
    height: height * 0.26,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "white",
  },
  logoText: {
    fontSize: width * 0.1,
  },
  content: {
    paddingTop: height * 0.03,
    height: height * 0.61,
    width: width,
    // justifyContent: "center",
    alignItems: "center",
    gap: height * 0.03,
    // backgroundColor: "blue",
  },
  timeSetLink: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: width,
    paddingRight: width * 0.07,
    gap: width * 0.01,
  },
  timeSetLinkText: {
    fontSize: width * 0.05,
    color: "#333",
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
