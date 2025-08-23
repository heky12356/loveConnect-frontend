import ReturnButton from "@/components/returnButton";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { height, width } = Dimensions.get("window");
const profileImg = require("@/assets/images/profile.png");

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
          <View style={styles.avatarContainer}>
            <Image source={profileImg} resizeMode="cover" style={styles.avatar} />
          </View>
          <MaterialIcons name="photo-camera" size={width * 0.06} color="#666" style={styles.cameraIcon} />
        </View>

        <View style={styles.profileInfo}>
          <ProfileItem label="姓名" value="李业伟" onPress={() => {
            router.push("/(profilePage)/editNamePage")
          }} />
          <ProfileItem label="性别" value="男" onPress={() => {
            router.push("/(profilePage)/editGenderPage")
          }} />
          <ProfileItem label="生日" value="2月30日" onPress={() => setShowBirthdayModal(true)} />
          <ProfileItem label="手机号" value="13800000000" onPress={() => {
            router.push("/(profilePage)/editPhonePage")
          }} />
          <ProfileItem label="所在地址" value="李业伟" onPress={() => {
            router.push("/(profilePage)/editLocationPage")
          }} />
        </View>

        <Pressable style={styles.editButton}>
          <Text style={styles.editButtonText}>更改资料</Text>
        </Pressable>

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
                onPress={() => setShowBirthdayModal(false)}
              >
                <Text style={styles.confirmButtonText}>确定</Text>
              </Pressable>
            </View>
            <View style={styles.birthdaySelector}>
              <Text style={styles.birthdayText}>1980 年  2  月  30 日</Text>
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
    right: width * 0.35,
    bottom: height * 0.02,
    backgroundColor: "white",
    borderRadius: width * 0.03,
    padding: width * 0.01,
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
    minHeight: height * 0.1,
  },
  birthdayText: {
     fontSize: width * 0.06,
     color: "#333",
     fontWeight: "500",
     letterSpacing: 2,
   },
});