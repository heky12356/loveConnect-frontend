import { getInfoManager } from "@/api/infoManeger";
import ReturnButton from "@/components/returnButton";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");
const infoManager = getInfoManager();

export default function EditGenderPage() {
  const [selectedGender, setSelectedGender] = useState("男");
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.gender) {
      // console.log(params)
      setSelectedGender(params.gender as string);
    }
  }, [params.gender]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerText}>性别</Text>
          </View>
          
          <View style={styles.optionsSection}>
            <Pressable 
              style={styles.optionItem}
              onPress={() => setSelectedGender("男")}
            >
              <Text style={styles.optionText}>男</Text>
              <View style={styles.radioContainer}>
                <View style={styles.radioButton} >
                  {selectedGender === "男" && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
              </View>
            </Pressable>
            
            <View style={styles.separator} />
            
            <Pressable 
              style={styles.optionItem}
              onPress={() => setSelectedGender("女")}
            >
              <Text style={styles.optionText}>女</Text>
              <View style={styles.radioContainer}>
                <View style={styles.radioButton} >
                  {selectedGender === "女" && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.buttonContainer}>
            <View style={styles.returnButtonWrapper}>
              <ReturnButton />
            </View>
            <Pressable style={styles.confirmButton} onPress={async () => {
              await infoManager.updateGender(selectedGender);
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
  optionsSection: {
    marginTop: height * 0.02,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.02,
  },
  optionText: {
    fontSize: width * 0.05,
    color: "#333",
  },
  radioContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  radioButton: {
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: width * 0.03,
    borderWidth: width * 0.007,
    borderColor: "#DDD",
    backgroundColor: "white",
  },
  radioButtonSelected: {
    width: width * 0.04,
    height: width * 0.04,
    borderRadius: width * 0.03,
    backgroundColor: "#FEADB4",
    // borderColor: "#DDD",
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: width * 0.02,
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