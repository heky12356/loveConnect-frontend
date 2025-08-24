import {
    Dimensions,
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

type Prop = {
  name?: string;
  img?: ImageSourcePropType;
  postNum?: number;
};

export default function FriendItem({ name, img, postNum }: Prop) {
  return (
    <View style={styles.container}>
      <View style={styles.viewBox}>
        <View style={styles.profile}>
          <Image source={img} style={styles.profileImg} />
        </View>
        <View style={styles.name}>
          <Text style={styles.nameText}>{name ? name : "name"}</Text>
        </View>
        {postNum ? (
          <View style={styles.postPot}>
            <Text style={styles.postNum}>{postNum}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height * 0.08,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  viewBox: {
    position: "relative",
    flexDirection: "row",
    height: height * 0.08,
    width: width * 0.85,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: width * 0.05,
    // gap: width * 0.03,
    paddingRight: width * 0.08,
    boxShadow:
      "0 8px 0 -4px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.15)",
  },
  profile: {
    height: height * 0.07,
    width: height * 0.07,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    // borderRadius: height * 0.08,
    marginLeft: width * 0.04,
  },
  profileImg: {
    height: height * 0.06,
    width: height * 0.06,
    // borderRadius: height * 0.08,
  },
  name: {
    height: height * 0.12,
    // width: width * 0.4,
    justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "yellow",
  },
  nameText: {
    fontSize: height * 0.03,
  },
  postPot: {
    position: "absolute",
    // top: height * 0.04,
    right: width * 0.02,
    height: height * 0.08,
    width: height * 0.08,
    borderRadius: height * 0.08,
    backgroundColor: "#FF6A6A",
    justifyContent: "center",
    alignItems: "center",
  },
  postNum: {
    fontSize: width * 0.08,
    color: "white",
  },
});
