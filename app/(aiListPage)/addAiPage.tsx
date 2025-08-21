import AiListAddItem from "@/components/aiListAddItem";
import ReturnButton from "@/components/returnButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const iconSize = height * 0.11;

export default function AddAiPage() {
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
        <View style={styles.profile}>
          <View style={styles.profileView}>
            <Ionicons name="add" size={iconSize} color="black" />
          </View>
        </View>
        <View style={styles.content}>
          <AiListAddItem tag="关系" label="女儿" />
          <AiListAddItem tag="电话" label="232323" />
          <AiListAddItem tag="关联青年版" label="是" />
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
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#FFD0D0",
    height: height,
    width: width,
  },
  profile: {
    height: height * 0.37,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "orange",
    paddingTop: height * 0.05,
  },
  profileView: {
    height: height * 0.27,
    width: height * 0.27,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: height * 0.27,
  },
  content: {
    paddingTop: height * 0.02,
    gap: height * 0.02,
    height: height * 0.5,
    width: width,
    // justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green",
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
