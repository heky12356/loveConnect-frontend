import { getInfoManager } from "@/api/infoManeger";
import ReturnButton from "@/components/returnButton";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert, Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

const { height, width } = Dimensions.get("window");
const infoManager = getInfoManager();

const LoadingIndicator = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFDEE2" />
    </View>
  );
};

export default function EditLocationPage() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.address) {
      setSelectedLocation(params.address as string);
    }
  }, []);

  const getCurrentLocation = async () => {
  try {
    setIsLoading(true);
    
    // 1. 请求位置权限
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('权限被拒绝', '需要位置权限才能获取当前位置');
      return;
    }

    // 2. 获取当前位置坐标
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    // console.log(location);

    const { latitude, longitude } = location.coords;

    // 3. 逆地理编码 - 将坐标转换为地址
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (reverseGeocode.length > 0) {
      const address = reverseGeocode[0];
      // 4. 组合地址字符串
      const fullAddress = [
        address.country,
        address.region,
        address.city,
        address.district,
        // address.street,
        // address.streetNumber
      ].filter(Boolean).join('');
      
      // 5. 更新状态
      setSelectedLocation(fullAddress || '无法获取详细地址');
    }
  } catch (error) {
    console.error('获取位置失败:', error);
    Alert.alert('获取位置失败', '请检查网络连接或稍后重试');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerText}>所在地址</Text>
          </View>
          
          <View style={styles.locationSection}>
            <View style={styles.currentLocationContainer}>
              <Text style={styles.currentLocationLabel}>当前位置</Text>
            </View>
            
            <Pressable style={styles.locationItem} onPress={getCurrentLocation}>
              <Text style={styles.locationText}>{selectedLocation}</Text>
              <EvilIcons name="location" size={width * 0.07} color="black" />
            </Pressable>
          </View>
        </View>
        {isLoading && <LoadingIndicator />}
        <View style={styles.bottomSection}>
          <View style={styles.buttonContainer}>
            <View style={styles.returnButtonWrapper}>
              <ReturnButton />
            </View>
            <Pressable style={styles.confirmButton} onPress={
              async () => {
                await infoManager.updateAddress(selectedLocation);
                router.back();
              }
            }>
              <Text style={styles.confirmButtonText}>确定</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    width: width,
  },
  content: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginHorizontal: width * 0.05,
    marginTop: height * 0.08,
    marginBottom: height * 0.15,
    borderRadius: width * 0.05,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
  },
  header: {
    alignItems: "center",
    marginBottom: height * 0.04,
  },
  headerText: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#333",
  },
  locationSection: {
    marginTop: height * 0.02,
  },
  currentLocationContainer: {
    marginBottom: height * 0.02,
  },
  currentLocationLabel: {
    fontSize: width * 0.045,
    color: "#666",
    fontWeight: "500",
  },
  locationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  locationText: {
    fontSize: width * 0.045,
    color: "#333",
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.03,
    height: "100%",
  },
  returnButtonWrapper: {
    justifyContent: "center",
  },
  confirmButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFDEE2",
    height: width * 0.17,
    width: width * 0.4,
    borderRadius: width * 0.05,
  },
  confirmButtonText: {
    fontSize: width * 0.06,
    lineHeight: width * 0.17,
    color: "#333",
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});