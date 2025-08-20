import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Prop = {
  onPress?: () => void;
  label?: string;
};

export default function AiLogoButton({ onPress, label }: Prop) {
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container]}>
        <ImageBackground
          source={require("../assets/images/logo.png")}
          style={styles.backgroundImage}
          resizeMode="contain"
        >
        </ImageBackground>
        <Text style={styles.text}>{label}</Text>
      </View>
    </Pressable>
  );
}
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: width * 0.4,
    width: width * 0.4,
    // borderRadius: 10,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: "100%",
    // backgroundColor: "red",
    margin: -width * 0.05,
  },
  text: {
    color: "black",
    fontSize: width * 0.05,
    // fontWeight: "bold",
    marginTop: -width * 0.01,
    marginBottom: width * 0.1,
  }
});
