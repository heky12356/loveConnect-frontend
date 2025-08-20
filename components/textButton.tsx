import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
const { height, width } = Dimensions.get("window");

const handleReturn = () => {
  console.log("字");
};

export default function ReturnButton() {
  return (
    <Pressable onPress={handleReturn}>
      <View style={style.Button}>
        <Text style={style.text}>字</Text>
      </View>
    </Pressable>
  );
}

const style = StyleSheet.create({
  Button: {
    height: width * 0.17,
    width: width * 0.17,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B3C1FF",
    borderRadius: width * 0.045,
  },
  text: {
    fontSize: width * 0.08,
    color: "black",
  },
});
