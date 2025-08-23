import ReturnButton from "@/components/returnButton";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");

export default function EditLocationPage() {
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
            
            <Pressable style={styles.locationItem}>
              <Text style={styles.locationText}>布吉岛</Text>
              <EvilIcons name="location" size={width * 0.07} color="black" />
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.buttonContainer}>
            <View style={styles.returnButtonWrapper}>
              <ReturnButton />
            </View>
            <Pressable style={styles.confirmButton}>
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
});