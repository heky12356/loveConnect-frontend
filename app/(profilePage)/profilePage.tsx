import { getInfoManager } from "@/api/infoManeger";
import ReturnButton from "@/components/returnButton";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");
const profileImg = require("@/assets/images/profile.png");
const infoManager = getInfoManager();

const ProfileItem = ({ label, value, showArrow = true, onPress }: { label: string; value: string; showArrow?: boolean; onPress?: () => void }) => {
  return (
    <Pressable style={styles.profileItem} onPress={onPress}>
      <Text style={styles.profileLabel}>{label}</Text>
      <View style={styles.profileValueContainer}>
        <Text style={styles.profileValue}>{value}</Text>
        {showArrow && (
          <MaterialIcons name="keyboard-arrow-right" size={width * 0.06} color="#666" />
        )}
      </View>
    </Pressable>
  );
};

export default function ProfilePage() {
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [info, setInfo] = useState<any>({});
  const [selectedYear, setSelectedYear] = useState(1990);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  // 生成年份数组 (1950-2024)
  const years = Array.from({ length: 75 }, (_, i) => 1950 + i);
  // 生成月份数组 (1-12)
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  // 根据年月生成天数数组
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  const days = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1);

  const fetchInfo = useCallback(async () => {
    const info = await infoManager.getInfo();
    console.log("page", info)
    setInfo(info);
  }, []);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  // 当页面获得焦点时自动刷新info
  useFocusEffect(
    useCallback(() => {
      fetchInfo();
    }, [fetchInfo])
  );

  // 处理头像上传
  const handleAvatarUpload = async () => {
    try {
      // 请求相册权限
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限不足', '需要访问相册权限来选择头像');
        return;
      }

      // 选择图片
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // 正方形头像
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploadingAvatar(true);
        
        try {
          // 创建File对象用于上传
          const asset = result.assets[0];
          const file = {
            uri: asset.uri,
            name: asset.fileName || `avatar_${Date.now()}.jpg`,
            type: asset.mimeType || 'image/jpeg'
          } as any;

          // 使用infoManager上传头像
          const avatarUrl = await infoManager.uploadAvatar(file);
          
          // 刷新用户信息
          await fetchInfo();
          
          Alert.alert('成功', '头像上传成功');
        } catch (error) {
          console.error('头像上传失败:', error);
          Alert.alert('错误', '头像上传失败，请重试');
        } finally {
          setIsUploadingAvatar(false);
        }
      }
    } catch (error) {
      console.error('选择图片失败:', error);
      Alert.alert('错误', '选择图片失败，请重试');
      setIsUploadingAvatar(false);
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
        <View style={styles.header}>
          <Text style={styles.headerText}>我的资料</Text>
        </View>
        
        <View style={styles.avatarSection}>
          <Pressable style={styles.avatarContainer} onPress={handleAvatarUpload} disabled={isUploadingAvatar}>
            <Image source={{uri: info.avatar}} resizeMode="cover" style={styles.avatar} />
            {isUploadingAvatar && (
              <View style={styles.uploadingOverlay}>
                <Text style={styles.uploadingText}>上传中...</Text>
              </View>
            )}
          </Pressable>
          <Pressable onPress={handleAvatarUpload} disabled={isUploadingAvatar}>
            <MaterialIcons name="photo-camera" size={width * 0.06} color="#666" style={styles.cameraIcon} />
          </Pressable>
        </View>

        <View style={styles.profileInfo}>
          <ProfileItem label="姓名" value={info.name} onPress={() => {
            router.push(`/(profilePage)/editNamePage?name=${info.name}`)
          }} />
          <ProfileItem label="性别" value={info.gender} onPress={() => {
            router.push(`/(profilePage)/editGenderPage?gender=${info.gender}`)
          }} />
          <ProfileItem label="生日" value={info.date || "请选择生日"} onPress={() => setShowBirthdayModal(true)} />
          <ProfileItem label="手机号" value={info.phone} onPress={() => {
            router.push(`/(profilePage)/editPhonePage?phone=${info.phone}`)
          }} />
          <ProfileItem label="所在地址" value={info.address} onPress={() => {
            router.push(`/(profilePage)/editLocationPage?address=${info.address}`)
          }} />
        </View>

        {/* <Pressable style={styles.editButton}>
          <Text style={styles.editButtonText}>更改资料</Text>
        </Pressable> */}

        <View style={styles.returnButton}>
          <ReturnButton />
        </View>
      </View>
      
      <Modal
        visible={showBirthdayModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBirthdayModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackground} 
            onPress={() => setShowBirthdayModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.birthdayContainer}>
              <Text style={styles.birthdayTitle}>生日</Text>
              <Pressable 
                style={styles.confirmButton}
                onPress={async () => {
                  // 保存选中的日期到 info 状态
                  const selectedDate = `${selectedYear}-${selectedMonth}-${selectedDay}`;
                  await infoManager.updateDate(selectedDate);
                  const info = await infoManager.getInfo();
                  setInfo(info);
                  setShowBirthdayModal(false);
                }}
              >
                <Text style={styles.confirmButtonText}>确定</Text>
              </Pressable>
            </View>
            <View style={styles.birthdaySelector}>
              <View style={styles.pickerContainer}>
                {/* 年份选择器 */}
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>年</Text>
                  <ScrollView 
                    style={styles.picker}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={40}
                    decelerationRate="fast"
                  >
                    {years.map((year) => (
                      <Pressable
                        key={year}
                        style={[
                          styles.pickerItem,
                          selectedYear === year && styles.selectedPickerItem
                        ]}
                        onPress={() => setSelectedYear(year)}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedYear === year && styles.selectedPickerItemText
                        ]}>
                          {year}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
                
                {/* 月份选择器 */}
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>月</Text>
                  <ScrollView 
                    style={styles.picker}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={40}
                    decelerationRate="fast"
                  >
                    {months.map((month) => (
                      <Pressable
                        key={month}
                        style={[
                          styles.pickerItem,
                          selectedMonth === month && styles.selectedPickerItem
                        ]}
                        onPress={() => {
                          setSelectedMonth(month);
                          // 如果当前选中的日期超过了新月份的最大天数，则调整日期
                          const maxDays = getDaysInMonth(selectedYear, month);
                          if (selectedDay > maxDays) {
                            setSelectedDay(maxDays);
                          }
                        }}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedMonth === month && styles.selectedPickerItemText
                        ]}>
                          {month}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
                
                {/* 日期选择器 */}
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>日</Text>
                  <ScrollView 
                    style={styles.picker}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={40}
                    decelerationRate="fast"
                  >
                    {days.map((day) => (
                      <Pressable
                        key={day}
                        style={[
                          styles.pickerItem,
                          selectedDay === day && styles.selectedPickerItem
                        ]}
                        onPress={() => setSelectedDay(day)}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedDay === day && styles.selectedPickerItemText
                        ]}>
                          {day}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </View>
              
              {/* 显示选中的日期 */}
              <View style={styles.selectedDateContainer}>
                <Text style={styles.selectedDateText}>
                  {selectedYear} 年 {selectedMonth} 月 {selectedDay} 日
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    width: width,
    alignItems: "center",
  },
  header: {
    paddingTop: height * 0.05,
    height: height * 0.12,
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "black",
  },
  avatarSection: {
    height: height * 0.15,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.12,
    width: height * 0.12,
    borderRadius: height * 0.06,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    height: height * 0.1,
    width: height * 0.1,
    borderRadius: height * 0.05,
  },
  cameraIcon: {
    position: "absolute",
    left: width * 0.08,
    bottom: height * 0.005,
    backgroundColor: "white",
    borderRadius: width * 0.03,
    padding: width * 0.01,
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: height * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingText: {
    color: "white",
    fontSize: width * 0.035,
    fontWeight: "500",
  },
  profileInfo: {
    flex: 1,
    width: width * 0.9,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: width * 0.03,
    paddingVertical: height * 0.02,
    marginTop: height * 0.02,
  },
  profileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  profileLabel: {
    fontSize: width * 0.045,
    color: "#333",
    fontWeight: "500",
  },
  profileValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileValue: {
    fontSize: width * 0.045,
    color: "#666",
    marginRight: width * 0.02,
  },
  editButton: {
    backgroundColor: "#FFDEE2",
    paddingHorizontal: width * 0.2,
    paddingVertical: height * 0.025,
    borderRadius: width * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  editButtonText: {
    fontSize: width * 0.05,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
  returnButton: {
    height: height * 0.13,
    width: width,
    justifyContent: "center",
    paddingLeft: width * 0.05,
    paddingBottom: height * 0.03,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: width * 0.05,
    padding: width * 0.05,
    width: width * 0.8,
    maxHeight: height * 0.6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  birthdayContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: width * 0.06,
    marginBottom: height * 0.02,
  },
  birthdayTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#FFDEE2",
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.012,
    borderRadius: width * 0.05,
  },
  confirmButtonText: {
    fontSize: width * 0.045,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
  birthdaySelector: {
    backgroundColor: "white",
    borderRadius: width * 0.03,
    alignItems: "center",
    justifyContent: "center",
    minHeight: height * 0.35,
    paddingVertical: height * 0.02,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    width: "100%",
    height: height * 0.25,
  },
  pickerColumn: {
    flex: 1,
    alignItems: "center",
  },
  pickerLabel: {
    fontSize: width * 0.04,
    color: "#666",
    fontWeight: "500",
    marginBottom: height * 0.01,
  },
  picker: {
    height: height * 0.2,
    width: width * 0.2,
  },
  pickerItem: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.02,
  },
  selectedPickerItem: {
    backgroundColor: "#FFDEE2",
    borderRadius: width * 0.02,
  },
  pickerItemText: {
    fontSize: width * 0.045,
    color: "#666",
  },
  selectedPickerItemText: {
    color: "#333",
    fontWeight: "600",
  },
  selectedDateContainer: {
    marginTop: height * 0.02,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    backgroundColor: "#F5F5F5",
    borderRadius: width * 0.02,
  },
  selectedDateText: {
    fontSize: width * 0.05,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
});