import { Text, View, StyleSheet, Dimensions } from "react-native";
import Foundation from "@expo/vector-icons/Foundation";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import BigButton from "@/components/BigButton";
import NavBar from "@/components/NavBar";
import AiLogoButton from "@/components/aiLogoButton";
import React from "react";

const { height, width } = Dimensions.get("window");

const GlobalGap = width * 0.05;
const GlobalFontSize = width * 0.1;

const handlePress = () => {
  console.log("Pressed!");
  router.push("/(about)/about");
};

export default function Index() {
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
              onPress={handlePress}
              label={"活动地图"}
              icon={
                <Feather name="map-pin" size={GlobalFontSize} color="black" />
              }
              backgroudColor="#FFDEE2"
            />
          </View>
          <View style={{ flexDirection: "row", gap: GlobalGap }}>
            <BigButton
              onPress={handlePress}
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
              onPress={handlePress}
              label={"学习乐园"}
              icon={
                <Feather name="book-open" size={GlobalFontSize} color="black" />
              }
              backgroudColor="#FFE7A4"
            />
          </View>
          <View style={{ flexDirection: "row", gap: GlobalGap }}>
            <BigButton
              onPress={handlePress}
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
              onPress={handlePress}
              label={"好友群组"}
              icon={
                <Feather name="users" size={GlobalFontSize} color="black" />
              }
              backgroudColor="#D9D9D9"
            />
          </View>
        </View>
        <View style={styles.logo}>
          <AiLogoButton label="有问题，问AI" />
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
    backgroundColor: "blue",
  },
  logo: {
    height: height * 0.22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
  navbar: {
    width: width,
    height: height * 0.13,
  },
});
