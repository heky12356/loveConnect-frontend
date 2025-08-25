import { getInfoManager } from "@/api/infoManeger";
import ReturnButton from "@/components/returnButton";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");
const infoManager = getInfoManager();

export default function EditNamePage() {
  const [name, setName] = useState("");
  const params = useLocalSearchParams();
  useEffect(() => {
    if (params.name) {
      setName(params.name as string);
      console.log(params.name);
    }
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerText}>更改名字</Text>
          </View>
          
          <View style={styles.inputSection}>
            <TextInput
              style={styles.textInput}
              placeholder={name}
              placeholderTextColor="#999"
              defaultValue={name}
              onChangeText={setName}
            />
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.buttonContainer}>
            <View style={styles.returnButtonWrapper}>
              <ReturnButton />
            </View>
            <Pressable style={styles.confirmButton} onPress={async () => {
              await infoManager.updateName(name);
              router.back();
            }}>
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
  inputSection: {
    marginTop: height * 0.01,
  },
  textInput: {
    backgroundColor: "white",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    fontSize: width * 0.06,
    color: "#333",
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
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
});