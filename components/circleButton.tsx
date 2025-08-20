import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
const { height, width } = Dimensions.get("window");

const iconSize = width * 0.15;


const handleReturn = () => {
  console.log("microphone pressed");
};

export default function ReturnButton() {
  return (
    <Pressable onPress={handleReturn}>
      <View style={style.Button}>
        <SimpleLineIcons name="microphone" size={iconSize} color="black" />
      </View>
    </Pressable>
  );
}

const style = StyleSheet.create({
  Button: {
    height: width * 0.3,
    width: width * 0.3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: width * 0.15,
  },
  text: {
    fontSize: width * 0.08,
    color: "black",
  },
});
