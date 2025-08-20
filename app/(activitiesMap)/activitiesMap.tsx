import ActivityItem from "@/components/activityItem";
import ReturnButton from "@/components/returnButton";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const exampleMap = require("@/assets/images/example_map.png");

export default function ActivitiesMap() {
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
        <View style={styles.map}>
          <View style={styles.mapView}>
            <Image source={exampleMap} style={styles.mapImage} />
          </View>
        </View>
        <View style={styles.content}>
          <ActivityItem title="广场舞" week="周六" time="上午9点" />
          <ActivityItem title="围棋比赛" week="周日" time="晚上5点" />
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
  map: {
    paddingTop: height * 0.05,
    height: height * 0.42,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "orange",
  },
  mapView: {
    height: height * 0.35,
    width: width * 0.8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
  },
  mapImage: {
    height: height * 0.32,
    width: width * 0.7,
  },
  content: {
    height: height * 0.45,
    width: width,
    // justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green",
    gap: height * 0.01,
    paddingTop: height * 0.01,
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
