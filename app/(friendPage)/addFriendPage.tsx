import ReturnButton from "@/components/returnButton";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");

export default function AddFriendPage() {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSearch = () => {
    console.log("搜索手机号:", phoneNumber);
    // 这里可以添加搜索逻辑
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
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>添加好友</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>手机联系人</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="请输入手机号..."
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
            
            <Text style={styles.hintText}>
              *添加好友后，即可看到对方动向，关注对方足迹
            </Text>
            
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>搜索</Text>
            </TouchableOpacity>
          </View>
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
    height: height,
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: height * 0.05,
    height: height * 0.15,
    width: width,
  },
  titleText: {
    fontSize: width * 0.1,
    // fontWeight: "bold",
    color: "black",
  },
  contentContainer: {
    flex: 1,
    width: width,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  sectionContainer: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: width * 0.06,
    fontWeight: "600",
    color: "black",
    marginBottom: height * 0.02,
  },
  inputContainer: {
    width: "100%",
    marginBottom: height * 0.02,
  },
  textInput: {
    height: height * 0.07,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: width * 0.05,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.04,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  hintText: {
    fontSize: width * 0.04,
    color: "#666",
    marginBottom: height * 0.04,
    lineHeight: width * 0.05,
  },
  searchButton: {
    height: height * 0.05,
    width: width * 0.25,
    backgroundColor: "#FFD6D6",
    borderRadius: width * 0.04,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    // shadowColor: "#000",
  },
  searchButtonText: {
    fontSize: width * 0.045,
    fontWeight: "600",
    color: "#333",
  },
  returnButton: {
    height: height * 0.13,
    width: width,
    justifyContent: "center",
    paddingLeft: width * 0.05,
    paddingBottom: height * 0.03,
  },
});