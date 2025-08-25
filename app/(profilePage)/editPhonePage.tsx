import ReturnButton from "@/components/returnButton";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");

export default function EditPhonePage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const params = useLocalSearchParams();
  useEffect(() => {
    if (params.phone) {
      setPhoneNumber(params.phone as string);
    }
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerText}>手机号</Text>
          </View>
          
          <View style={styles.phoneSection}>
            <View style={styles.currentPhoneContainer}>
              <Text style={styles.currentPhoneLabel}>已绑定手机号：</Text>
              <Text style={styles.currentPhoneNumber}>{phoneNumber}</Text>
            </View>
            
            <Pressable style={styles.changePhoneButton} onPress={() => {
              Alert.alert("更换手机号", "暂时不支持本地修改，请联系管理员，抱歉~");
            }}>
              <Text style={styles.changePhoneButtonText}>更换手机号</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.returnButtonWrapper}>
            <ReturnButton />
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
  phoneSection: {
    marginTop: height * 0.02,
    alignItems: "center",
  },
  currentPhoneContainer: {
    alignItems: "center",
    marginBottom: height * 0.04,
  },
  currentPhoneLabel: {
    fontSize: width * 0.05,
    color: "#333",
    marginBottom: height * 0.01,
  },
  currentPhoneNumber: {
    fontSize: width * 0.045,
    color: "#333",
    fontWeight: "500",
  },
  changePhoneButton: {
    backgroundColor: "#FFDEE2",
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.02,
    borderRadius: width * 0.05,
    marginBottom: height * 0.03,
  },
  changePhoneButtonText: {
    fontSize: width * 0.05,
    color: "#333",
    fontWeight: "500"
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.15,
  },
  returnButtonWrapper: {
    justifyContent: "center",
    paddingLeft: width * 0.05,
    paddingBottom: height * 0.03,
    height: "100%",
  },
});