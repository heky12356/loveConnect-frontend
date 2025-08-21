import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
const { width, height } = Dimensions.get("window");

const iconSize = width * 0.08;

type Prop = {
  onPress?: () => void;
}

export default function AiListAddItemButton({onPress}: Prop) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <View style={styles.viewBox}>
          <FontAwesome6 name="add" size={iconSize} color="black" />
        </View>
      </Pressable>
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
    justifyContent: "center",
    backgroundColor: "#FFC7C7",
    borderRadius: width * 0.05,
    gap: width * 0.1,
  },
});
