import FriendItem from "@/components/friendItem";
import ReturnButton from "@/components/returnButton";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");
const exampleImg = require("@/assets/images/friendItemProfile_example.png");
const GlobalFontSize = width * 0.08;

const handleAddFriendPress = () => {
  router.push("/(friendPage)/addFriendPage");
};

export default function FriendPage() {
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
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>好友群组</Text>
        </View>

        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.addFriendContainer}>
              <Pressable onPress={handleAddFriendPress} style={styles.addFriendButton}>
                <Text style={styles.addFriendText}>添加好友</Text>
                <Feather name="users" size={GlobalFontSize} color="black" />
              </Pressable>
            </View>

            <View style={styles.friendsList}>
              <FriendItem name="AAA批发鸡蛋王哥" img={exampleImg} />
              <FriendItem name="王丽芬" img={exampleImg} />
              <FriendItem name="琳琳" img={exampleImg} />
              <FriendItem name="驰芭纱" img={exampleImg} />
              <FriendItem name="步香汤雪" img={exampleImg} />
            </View>
          </ScrollView>
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
    flex: 1,
    height: height,
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: height * 0.05,
    height: height * 0.15,
    width: width,
  },
  titleText: {
    fontSize: width * 0.1,
    // fontWeight: "bold",
    color: "black",
  },
  contentContainer: {
    flex: 1,
    width: width,
    // paddingHorizontal: width * 0.05,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: height * 0.02,
  },
  addFriendContainer: {
    height: height * 0.09,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  addFriendButton: {
    flexDirection: "row",
    height: height * 0.09,
    width: width * 0.85,
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: width * 0.05,
    backgroundColor: "#E1EAFF",
    borderRadius: width * 0.06,
    paddingLeft: width * 0.05,
    gap: width * 0.03,
    boxShadow: '0 8px 0 -4px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.15)',
  },
  addFriendText: {
    fontSize: width * 0.08,
    lineHeight: height * 0.09,
    color: "#333",
  },
  friendsList: {
    width: width,
    gap: height * 0.015,
  },
  returnButton: {
    height: height * 0.13,
    width: width,
    justifyContent: "center",
    paddingLeft: width * 0.05,
    paddingBottom: height * 0.03,
  },
});