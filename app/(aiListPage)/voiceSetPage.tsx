import { router } from "expo-router";
import { Dimensions, Pressable, StyleSheet, Text } from "react-native";
const { width, height } = Dimensions.get("window");

export default function VoiceSetPage() {
  return (
    <Pressable style={styles.container} onPress={
        () => {
            const data = {
                voice: "123",
            }
            const params = encodeURIComponent(JSON.stringify(data));
            router.push(`/(aiListPage)/addAiPage?data=${params}`)
        }
    }>
      <Text>VoiceSetPage</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#FFD0D0",
    height: height,
    width: width,
  },
});
