import { Dimensions, Pressable, StyleSheet, Text } from "react-native";
const { height, width } = Dimensions.get("window");

type Prop = {
  onPress?: () => void;
}

export default function EndButton({onPress}: Prop) {
  return (
      <Pressable style={style.endButton} onPress={onPress}>
        <Text style={style.text}>完成</Text>
      </Pressable>
  );
}

const style = StyleSheet.create({
  endButton: {
    height: width * 0.17,
    width: width * 0.35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: width * 0.045,
  },
  text: {
    color: "black",
    fontSize: width * 0.06,
    lineHeight: width * 0.17,
  }
});
