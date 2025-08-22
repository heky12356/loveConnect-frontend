import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";

const { width, height } = Dimensions.get("window");

type Prop = {
  tag?: string;
  label?: string;
  dropBox?: boolean;
};

export default function AiListAddItem({ tag, label, dropBox }: Prop) {
  return (
    <View style={styles.container}>
      <View style={styles.viewBox}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{tag ? tag : "tag"}</Text>
        </View>
        <View style={styles.name}>
          {dropBox ? (
            <View style={styles.dropBox}>
              <Text>下拉框</Text>
            </View>
          ) : (
            <TextInput
              style={styles.nameText}
              placeholder={label ? label : "label"}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height * 0.12,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  viewBox: {
    flexDirection: "row",
    height: height * 0.12,
    width: width * 0.85,
    alignItems: "center",
    backgroundColor: "#E1EAFF",
    borderRadius: width * 0.05,
    gap: width * 0.1,
    paddingLeft: width * 0.07,
  },
  tag: {
    height: height * 0.11,
    // width: width * 0.4,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "white",
    // borderRadius: height * 0.11,
    marginLeft: width * 0.02,
  },
  tagText: {
    fontSize: height * 0.04,
  },
  dropBox: {
    height: height * 0.12,
    width: width * 0.2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    // borderRadius: height * 0.11,
  },
  name: {
    height: height * 0.12,
    // width: width * 0.4,
    justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "yellow",
  },
  nameText: {
    fontSize: height * 0.04,
  },
});
