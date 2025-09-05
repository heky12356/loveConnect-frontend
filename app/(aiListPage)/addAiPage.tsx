import { ImageUploadOptions, uploadImage } from "@/api/util";
import AiListAddItem from "@/components/aiListAddItem";
import NextStepButton from "@/components/nextStepButton";
import ReturnButton from "@/components/returnButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const iconSize = height * 0.11;

export default function AddAiPage() {
  const [voice, setVoice] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const data = useLocalSearchParams<{
    data: string;
  }>();

  useEffect(() => {
    console.log("data", data);
    if (data.data) {
      const uncodeData = JSON.parse(decodeURIComponent(data.data));
      if (uncodeData.voice) {
        setVoice(uncodeData.voice);
      }
    }
  }, []);

  const handleAddImg = async () => {
    try {
      // 请求媒体库权限
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("权限不足", "需要访问相册权限才能选择头像");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // 正方形头像
        quality: 0.8,
        base64: false,
      });
      if (!result.canceled && result.assets[0]) {
        const data: ImageUploadOptions = {
          uri: result.assets[0].uri,
        };

        const res = await uploadImage(data);
        if (res) {
          setSelectedImage(res.url);
        } else {
          Alert.alert("错误", "上传图片失败，请重试");
        }
      }
    } catch (error) {
      console.error("选择图片失败:", error);
      Alert.alert("错误", "选择图片失败，请重试");
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert("提示", "请输入名称");
      return false;
    }
    if (!role.trim()) {
      Alert.alert("提示", "请输入关系");
      return false;
    }
    if (!selectedImage) {
      Alert.alert("提示", "请选择头像");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    interface Data {
      role: string;
      name: string;
      image: string;
    }
    const data: Data = {
      role: role,
      name: name,
      image: selectedImage!,
    };
    router.push(
      `/(aiVoiceSetPage)/aiVoiceSetPage?data=${encodeURIComponent(
        JSON.stringify(data)
      )}`
    );
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
          <AiListAddItem tag="名称" label="名称" onchange={setName} />
          <AiListAddItem tag="关系" label="关系" onchange={setRole} />
          {/* <AiListAddItem
            tag={voice}
            label=""
            newPage={true}
            path="/(aiListPage)/voiceSetPage"
          /> */}
        </View>
        <View style={styles.returnButton}>
          <ReturnButton />
          <NextStepButton onPress={handleNext} />
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
    flexDirection: "row",
    justifyContent: "space-between",
    height: height * 0.13,
    width: width,
    alignItems: "center",
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    paddingBottom: height * 0.03,
  },
});
