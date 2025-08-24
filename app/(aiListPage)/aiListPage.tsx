import AiListAddItemButton from "@/components/aiListAddItemButton";
import AiListItem from "@/components/aiListItem";
import ReturnButton from "@/components/returnButton";
import { useImg } from "@/hook/useImg";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";
const { width, height } = Dimensions.get("window");

const handleAddItemPress = () => {
  router.push("/addAiPage");
};

export default function AiListPage() {
  const exampleImg = useImg().getImg("001");
  // const exampleImg = require(ImgUri);
  // console.log(exampleImg);

  return (
    <LinearGradient
      colors={["#FFD0D0", "#EDFFB8", "#FFFFFF", "#FFCBCB"]}
      locations={[0.1, 0.4, 0.5, 0.9]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <AiListItem name="女儿" img={exampleImg} />
          <AiListItem name="儿子" />
          <AiListItem name="儿媳妇" />
          <AiListAddItemButton onPress={handleAddItemPress} />
        </View>
        <View style={styles.returnButton}>
          <ReturnButton path="/" />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: width * 0.1,
    paddingRight: width * 0.1,
    width: width,
    height: height,
  },
  content: {
    height: height * 0.8,
    width: width,
    paddingTop: height * 0.1,
    // justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "orange",
    gap: height * 0.03,
  },
  returnButton: {
    height: height * 0.13,
    width: width,
    justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "orange",
    paddingLeft: width * 0.05,
    paddingBottom: height * 0.03,
  },
});
