import { ImageUploadOptions, uploadImage } from "@/api/util";
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
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const guideLogo = require("@/assets/images/aiscreenn.png");

export default function AiChatScreenshotPage() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [aiData, setAiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const data = useLocalSearchParams<{
    data: string;
  }>();

  useEffect(() => {
    if (data.data) {
      const decodedData = JSON.parse(decodeURIComponent(data.data));
      setAiData(decodedData);
    }
  }, []);

  const handleAddImage = async () => {
    try {
      // 请求媒体库权限
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("权限不足", "需要访问相册权限才能选择图片");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        selectionLimit: 10, // 限制最多选择10张图片
      });

      if (!result.canceled && result.assets) {
        const uploadPromises = result.assets.map(async (asset) => {
          const uploadData: ImageUploadOptions = {
            uri: asset.uri,
          };
          const uploadResult = await uploadImage(uploadData);
          return uploadResult?.url;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        const validUrls = uploadedUrls.filter(url => url) as string[];
        
        setSelectedImages(prev => [...prev, ...validUrls]);
      }
    } catch (error) {
      console.error("选择图片失败:", error);
      Alert.alert("错误", "选择图片失败，请重试");
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (selectedImages.length === 0) {
      Alert.alert("提示", "请至少上传一张聊天截图");
      return;
    }

    setIsLoading(true);
    try {
      // 将本地图片上传到图床，获取URL
      const imageUrls: string[] = [];

      for (const imageUri of selectedImages) {
        console.log('正在上传图片:', imageUri);
        const uploadedUrl = await uploadImage({ uri: imageUri });
        if (uploadedUrl?.url) {
          imageUrls.push(uploadedUrl.url);
        }
        console.log('图片上传成功:', uploadedUrl);
      }

      const updatedData = {
        ...aiData,
        chatScreenshots: selectedImages, // 保留本地路径（用于UI显示）
        chatImages: imageUrls, // 新增：图床URL（用于API调用）
      };

      console.log('所有图片上传完成，图片URL:', imageUrls);

      router.push(
        `/(aiPersonalityPage)/aiPersonalityPage?data=${encodeURIComponent(
          JSON.stringify(updatedData)
        )}`
      );
    } catch (error) {
      console.error('图片上传失败:', error);
      Alert.alert("错误", "图片上传失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    const updatedData = {
      ...aiData,
      chatScreenshots: [],
    };

    router.push(
      `/(aiSkipPage)/aiSkipPage?data=${encodeURIComponent(
        JSON.stringify(updatedData)
      )}`
    );
  };

  return (
    <LinearGradient
      colors={["#FFD0D0", "#EDFFB8", "#FFFFFF", "#FFCBCB"]}
      locations={[0.1, 0.4, 0.6, 0.9]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* 标题区域 */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Image
                source={guideLogo}
                style={styles.avatarImage}
              />
            </View>
          </View>
        </View>

        {/* 内容区域 */}
        <View style={styles.contentContainer}>
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>请至少上传五张图片哦</Text>
            <Ionicons name="volume-high" size={24} color="#FF6B6B" />
          </View>

          <ScrollView style={styles.imageGrid} showsVerticalScrollIndicator={false}>
            <View style={styles.gridContainer}>
              {selectedImages.map((imageUrl, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: imageUrl }} style={styles.uploadedImage} />
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </Pressable>
                </View>
              ))}
              
              {/* 添加图片按钮 */}
              <Pressable style={styles.addImageButton} onPress={handleAddImage}>
                <Ionicons name="add" size={40} color="#999" />
              </Pressable>
            </View>
          </ScrollView>
        </View>

        {/* 底部按钮区域 */}
        <View style={styles.buttonContainer}>
          <ReturnButton />
          <View style={styles.rightButtons}>
            <NextStepButton onPress={isLoading ? undefined : handleNext} />
            {isLoading && (
              <Text style={styles.loadingText}>上传中...</Text>
            )}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * 0.05,
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: height * 0.03,
  },
  avatarContainer: {
    marginBottom: height * 0.02,
  },
  avatar: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.1,
    // backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: width * 0.1,
  },
  avatarText: {
    fontSize: width * 0.08,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "500",
    color: "#333",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.05,
    marginBottom: height * 0.02,
  },
  instructionText: {
    fontSize: width * 0.04,
    color: "#666",
    marginRight: width * 0.02,
  },
  imageGrid: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255,1)",
    paddingBottom: height * 0.02,
  },
  imageContainer: {
    position: "relative",
    width: (width - width * 0.15) / 3,
    height: (width - width * 0.15) / 3 * 1.5,
    marginBottom: width * 0.025,
    borderRadius: width * 0.02,
    overflow: "hidden",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  addImageButton: {
    width: (width - width * 0.15) / 3,
    height: (width - width * 0.15) / 3 * 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: width * 0.02,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: width * 0.025,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.03,
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.03,
  },
  loadingText: {
    fontSize: width * 0.035,
    color: "#666",
    marginLeft: width * 0.02,
  },
  skipButton: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: width * 0.03,
  },
  skipButtonText: {
    fontSize: width * 0.04,
    color: "#666",
  },
});