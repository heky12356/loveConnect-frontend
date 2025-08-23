import AiListAddItem from "@/components/aiListAddItem";
import ReturnButton from "@/components/returnButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const iconSize = height * 0.11;

export default function AddAiPage() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const handleAddImg = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("你没有选择图片");
    }
  };
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
        <View style={styles.profile}>
          <Pressable style={styles.profileView} onPress={handleAddImg}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.image} />
            ) : (
              <Ionicons name="add" size={iconSize} color="black" />
            )}
          </Pressable>
        </View>
        <View style={styles.content}>
          <AiListAddItem tag="关系" label="女儿" />
          <AiListAddItem tag="电话" label="232323" />
          <AiListAddItem tag="关联青年版" label="是" />
        </View>
        <View style={styles.returnButton}>
          <ReturnButton />
        </View>
      </View>
    </LinearGradient>
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
  profile: {
    height: height * 0.37,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "orange",
    paddingTop: height * 0.05,
  },
  profileView: {
    height: height * 0.27,
    width: height * 0.27,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: height * 0.27,
  },
  image: {
    height: height * 0.25,
    width: height * 0.25,
    borderRadius: height * 0.25,
  },
  content: {
    paddingTop: height * 0.02,
    gap: height * 0.02,
    height: height * 0.5,
    width: width,
    // justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green",
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
