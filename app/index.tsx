import BigButton from "@/components/BigButton";
import NavBar from "@/components/NavBar";
import AiLogoButton from "@/components/aiLogoButton";
import { useFirstAttention } from "@/hook/getFirstAttention";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { height, width } = Dimensions.get("window");

const GlobalGap = width * 0.05;
const GlobalFontSize = width * 0.1;

const handlePress = () => {
  console.log("Pressed!");
  router.push("/(about)/about");
};

const handleTimingSetPress = () => {
  // console.log("TimingSet Pressed!");
  router.push("/(timingSet)/timingSet");
};

const handleActivitiesMapPress = () => {
  router.push("/(activitiesMap)/activitiesMap");
};

const handleMsgPress = () => {
  router.push("/(msgPage)/msgPage");
};

const handleStudyPagePress = () => {
  router.push("/(studyPage)/studyPage");
};

const handleFriendPress = () => {
  router.push("/(friendPage)/friendPage");
};

export default function Index() {
  const [isFirstAttention, setIsFirstAttention] = useFirstAttention();

  return (
    <LinearGradient
      colors={["#FFE9EA", "#EDFFB8", "#FFFFFF"]}
      locations={[0.1, 0.4, 0.7]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <NavBar style={styles.navbar} />
        <View style={styles.buttonContainer}>
          <View
            style={{
              flexDirection: "row",
              gap: GlobalGap,
            }}
          >
            <BigButton
              onPress={handlePress}
              label={"一键呼出"}
              icon={
                <Foundation
                  name="telephone"
                  size={GlobalFontSize}
                  color="black"
                />
              }
              backgroudColor="#d9e2ff"
            />
            <BigButton
              onPress={handleActivitiesMapPress}
              label={"活动地图"}
              icon={
                <Feather name="map-pin" size={GlobalFontSize} color="black" />
              }
              backgroudColor="#FFDEE2"
            />
          </View>
          <View style={{ flexDirection: "row", gap: GlobalGap }}>
            <BigButton
              onPress={handleTimingSetPress}
              label={"定时设置"}
              icon={
                <Fontisto
                  name="heartbeat-alt"
                  size={GlobalFontSize}
                  color="black"
                />
              }
              backgroudColor="#ADFFD7"
            />
            <BigButton
              onPress={handleStudyPagePress}
              label={"学习乐园"}
              icon={
                <Feather name="book-open" size={GlobalFontSize} color="black" />
              }
              backgroudColor="#FFE7A4"
            />
          </View>
          <View style={{ flexDirection: "row", gap: GlobalGap }}>
            <BigButton
              onPress={handleMsgPress}
              label={"消息通知"}
              icon={
                <MaterialCommunityIcons
                  name="message-outline"
                  size={GlobalFontSize}
                  color="black"
                />
              }
              backgroudColor="#FFCDCD"
            />
            <BigButton
              onPress={handleFriendPress}
              label={"好友群组"}
              icon={
                <Feather name="users" size={GlobalFontSize} color="black" />
              }
              backgroudColor="#D9D9D9"
            />
          </View>
        </View>
        <View style={styles.logo}>
          <AiLogoButton label="有问题，问AI" isFirstAttention={isFirstAttention} setIsFirstAttention={setIsFirstAttention} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: height * 0.65,
    justifyContent: "center",
    alignItems: "center",
    gap: GlobalGap,
    // backgroundColor: "blue",
  },
  logo: {
    height: height * 0.22,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green",
  },
  navbar: {
    width: width,
    height: height * 0.13,
  },
});
