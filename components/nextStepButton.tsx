import { Dimensions, Pressable, StyleSheet, Text } from "react-native";
const { height, width } = Dimensions.get("window");

type Prop = {
  onPress?: () => void;
}

export default function NextStepButton({onPress}: Prop) {
  return (
      <Pressable style={style.returnButton} onPress={onPress}>
        <Text style={style.text}>下一步</Text>
      </Pressable>
  );
}

const style = StyleSheet.create({
  returnButton: {
    height: width * 0.17,
    width: width * 0.35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEEEBD",
    borderRadius: width * 0.045,
  },
  text: {
    color: "black",
    fontSize: width * 0.06,
    lineHeight: width * 0.17,
  }
});
