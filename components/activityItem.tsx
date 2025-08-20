import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from "@expo/vector-icons/Feather";
import { Dimensions, StyleSheet, Text, View } from "react-native";
const { width, height } = Dimensions.get("window");

const iconSize = width * 0.1;
const iconTailSize = width * 0.05;

type Props = {
    title: string;
    week: string;
    time: string;
}

const AttendButton = () => {
    return (
        <View style={styles.attendButton}>
            <Text style={styles.attendButtonText}>
                参加
            </Text>
        </View>
    )
}

const PlayButton = () => {
  return (
    <View style={styles.playButton}>
      <Feather name="play-circle" size={iconSize} color="black" />
      <View style={styles.playButtonIconTail}>
        <AntDesign name="sound" size={iconTailSize} color="black" />
      </View>
    </View>
  );
};

export default function ActivityItem({title, week, time}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.playButtonView}>
        <PlayButton />
      </View>
      <View style={styles.content}>
        <View style={styles.title}>
            <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.time}>
            <View>
                <Text style={styles.timeText}>{week}</Text>
            </View>
            <View>
                <Text style={styles.timeText}>
                    {time}
                </Text>
            </View>
        </View>
        <View style={styles.friend}>
            <Text>朋友已参加</Text>
            <AntDesign name="arrowright" size={15} color="black" />
        </View>
        <View style={styles.button}>
            <AttendButton />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: height * 0.17,
    width: width * 0.8,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  playButtonView: {
    height: height * 0.17,
    width: width * 0.35,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "orange",
  },
  playButton: {
    position: "relative",
    height: width * 0.32,
    width: width * 0.32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFDEE2",
    borderRadius: width * 0.045,
  },
  playButtonIconTail: {
    position: "absolute",
    top: width * 0.23,
    left: width * 0.23,
    zIndex: 10,
  },
  content: {
    paddingLeft: width * 0.02,
    height: height * 0.17,
    width: width * 0.45,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "blue",
  },
  title: {
    height: height * 0.05,
    width: width * 0.43,
    justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "red",
  },
  titleText: {
    fontSize: width * 0.065,
  },
  time: {
    flexDirection: "row",
    height: height * 0.04,
    width: width * 0.43,
    justifyContent: "flex-start",
    gap: width * 0.12,
    alignItems: "center",
    // backgroundColor: "yellow",
  },
  timeText: {
    fontSize: width * 0.045,
  },
  friend: {
    flexDirection: "row",
    height: height * 0.03,
    width: width * 0.43,
    justifyContent: "flex-start",
    alignItems: "center",
    // backgroundColor: "orange",
  },
  button: {
    flexDirection: "row",
    height: height * 0.05,
    width: width * 0.43,
    justifyContent: "flex-end",
    alignItems: "center",
    // backgroundColor: "purple",
    paddingRight: width * 0.03,
  },
  buttonText: {
    fontSize: width * 0.05,
    color: "white",
  },
  attendButton: {
    height: height * 0.04,
    width: width * 0.15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEADB4",
    borderRadius: width * 0.04,
  },
  attendButtonText: {
    fontSize: width * 0.045,
    color: "black",
  },
});
