import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { Dimensions, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
const { width, height } = Dimensions.get("window");

type Prop = {
  tag?: string;
  label?: string;
  newPage?: boolean;
  path?: string;
  onchange?: (value: string) => void;
  onlyNum?: boolean;
};

const iconSize = width * 0.1;

export default function AiListAddItem({ tag, label, newPage, path, onchange, onlyNum }: Prop) {
  return (
    <View style={styles.container}>
      <View style={[styles.viewBox, {
        justifyContent: newPage ? "space-between" : "flex-start",
      }]}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{tag ? tag : ""}</Text>
        </View>
        <View style={styles.name}>
          {newPage ? (
            <Pressable style={styles.newPageView} onPress={() => {
              if (path) {
                router.push(path as any);
              }
            }}>
              {/* <Text style={styles.nameText}>{label ? label : "label"}</Text> */}
              <AntDesign name="right" size={iconSize} color="black" />
            </Pressable>
          ) : (
            <TextInput
              style={styles.nameText}
              placeholder={label ? label : "label"}
              onChangeText={onchange}
              keyboardType={onlyNum ? "number-pad" : "default"}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height * 0.1,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  viewBox: {
    flexDirection: "row",
    height: height * 0.1,
    width: width * 0.85,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: width * 0.05,
    gap: width * 0.1,
    paddingLeft: width * 0.07,
    boxShadow: "0 8px 0 -4px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.15)",
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
  newPageView: {
    marginLeft: width * 0.3,
    flexDirection: "row",
    height: height * 0.1,
    width: width * 0.2,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
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
