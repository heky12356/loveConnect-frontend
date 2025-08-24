import ReturnButton from "@/components/returnButton";
import StudyItem from "@/components/studyItem";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");
const iconSize = width * 0.1;

export default function StudyPage() {
  const handleCategoryPress = (category: string) => {
    console.log(`选择了分类: ${category}`);
    // 这里可以添加导航逻辑
  };

  const handleMorePress = () => {
    console.log("点击了更多");
    // 这里可以添加更多功能的导航逻辑
  };

  return (
    <LinearGradient
      colors={["#FFFFFF", "#FFCBCB"]}
      style={styles.container}
      locations={[0.6, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.titleContainer}>
        <Feather
          style={{
            marginTop: height * 0.01,
          }}
          name="book-open"
          size={iconSize}
          color="black"
        />
        <Text style={styles.titleText}>学习乐园</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.categoryGrid}>
          <View style={styles.categoryRow}>
            <StudyItem
              label="棋类"
              onPress={() => handleCategoryPress("棋类")}
            />
            <StudyItem
              label="乐器"
              onPress={() => handleCategoryPress("乐器")}
            />
          </View>
          <View style={styles.categoryRow}>
            <StudyItem
              label="冥想"
              onPress={() => handleCategoryPress("冥想")}
            />
            <StudyItem
              label="手工"
              onPress={() => handleCategoryPress("手工")}
            />
          </View>
        </View>

        <Pressable style={styles.moreButton} onPress={handleMorePress}>
          <Text style={styles.moreText}>更多...</Text>
        </Pressable>
      </View>

      <View style={styles.returnButton}>
        <ReturnButton />
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: height * 0.05,
    height: height * 0.15,
    width: width,
    gap: width * 0.05,
  },
  titleIcon: {
    fontSize: width * 0.08,
  },
  titleText: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#333",
  },
  contentContainer: {
    flex: 1,
    // justifyContent: "center",
    paddingTop: height * 0.05,
    alignItems: "center",
    width: width,
    paddingHorizontal: width * 0.1,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 0.8,
    gap: height * 0.02,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 0.8,
    gap: height * 0.02,
  },
  categoryText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
  },
  moreButton: {
    marginTop: height * 0.03,
    alignSelf: "flex-end",
    paddingRight: width * 0.05,
  },
  moreText: {
    fontSize: width * 0.045,
    color: "#666",
  },
  returnButton: {
    height: height * 0.13,
    width: width,
    justifyContent: "center",
    paddingLeft: width * 0.05,
    paddingBottom: height * 0.03,
  },
});
