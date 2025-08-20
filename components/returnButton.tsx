import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from "expo-router";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
const { height, width } = Dimensions.get("window");

const handleReturn = () => {
//   console.log("return");
  router.back();
};

const iconStyle = width * 0.1;



export default function ReturnButton() {
  return (
    <Pressable onPress={handleReturn}>
      <View style={style.returnButton}>
        <AntDesign name="left" size={iconStyle} color="white" />
      </View>
    </Pressable>
  );
}

const style = StyleSheet.create({
  returnButton: {
    height: width * 0.17,
    width: width * 0.17,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6E6E",
    borderRadius: width * 0.045,
  },
});
