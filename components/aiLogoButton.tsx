import { router } from "expo-router";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

type Prop = {
  label: string;
  isFirstAttention: boolean;
  setIsFirstAttention: (isFirstAttention: boolean) => void;
};
const handleAiPress = ({
  isFirstAttention,
  setIsFirstAttention,
}: {
  isFirstAttention: boolean;
  setIsFirstAttention: (isFirstAttention: boolean) => void;
}) => {
  // console.log("AI Pressed!");
  if (isFirstAttention) {
    // setIsFirstAttention(false);
    console.log("isFirstAttention", isFirstAttention);
    router.push({
      pathname: "/(aiPage)/firstAttentionPage",
    });
  } else {
    router.push("/(aiListPage)/aiListPage");
  }
};

export default function AiLogoButton({
  label,
  isFirstAttention,
  setIsFirstAttention,
}: Prop) {
  return (
    <Pressable
      style={[styles.container]}
      onPress={() => handleAiPress({ isFirstAttention, setIsFirstAttention })}
    >
      <ImageBackground
        source={require("../assets/images/logo.png")}
        style={styles.backgroundImage}
        resizeMode="contain"
      ></ImageBackground>
      <Text style={styles.text}>{label}</Text>
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
  },
});
