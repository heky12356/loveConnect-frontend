import NormalNavBar from "@/components/normalNavBar";
import ReturnButton from "@/components/returnButton";
import TimeSetItem from "@/components/timeSetItem";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";

import { Dimensions, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");
const iconStyle = width * 0.1;
export default function TimingSet() {
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
      <View style={style.container}>
        <View style={style.navbar}>
          <NormalNavBar />
        </View>
        <View style={style.title}>
          <Feather name="watch" size={iconStyle} color="black" />
          <Text style={style.titleText}>定时设置</Text>
        </View>
        <View style={style.content}>
          <TimeSetItem title="起床" time="8:00" />
          <TimeSetItem title="吃药" time="11:30" />
          <TimeSetItem title="看电视" time="19:00" />
          <TimeSetItem title="遛弯" time="17:00" />
        </View>
        <View style={style.returnButton}>
          <ReturnButton />
        </View>
      </View>
    </LinearGradient>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: height,
    width: width,
    // backgroundColor: "red",
  },
  navbar: {
    height: height * 0.1,
  },
  title: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.08,
    width: width,
    // backgroundColor: "green",
  },
  titleText: {
    fontSize: width * 0.08,
    // fontWeight: "bold",
    color: "black",
  },
  content: {
    flex: 1,
    paddingTop: height * 0.01,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: width * 0.9,
    gap: height * 0.01,
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
