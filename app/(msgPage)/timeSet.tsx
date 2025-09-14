import { timeManager } from "@/api/timeManager";
import ReturnButton from "@/components/returnButton";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");

export default function TimeSet() {
  const [selectedHour, setSelectedHour] = useState(2);
  const [selectedMinute, setSelectedMinute] = useState(1);

  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const itemHeight = height * 0.06;

  const handleHourScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    if (index >= 0 && index < 24) {
      setSelectedHour(index);
    }
  };

  const handleMinuteScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    if (index >= 0 && index < 60) {
      setSelectedMinute(index);
    }
  };

  const handleConfirm = async () => {
    const timeString = `${selectedHour.toString().padStart(2, "0")}:${selectedMinute
      .toString()
      .padStart(2, "0")}`;
    
    console.log(`设置时间: ${timeString}`);
    
    try {
      // 调用API更新定时问候时间
      const result = await timeManager.updateGreetingCron(timeString);
      
      if (result.success) {
        Alert.alert(
          "设置成功",
          `定时问候时间已设置为 ${timeString}`,
          [{ text: "确定" }]
        );
      } else {
        Alert.alert(
          "设置失败",
          result.message,
          [{ text: "确定" }]
        );
      }
    } catch (error) {
      console.error('设置定时问候时间失败:', error);
      Alert.alert(
        "设置失败",
        "网络错误，请稍后重试",
        [{ text: "确定" }]
      );
    }
  };

  const handleReset = () => {
    setSelectedHour(0);
    setSelectedMinute(0);
    hourScrollRef.current?.scrollTo({ y: 0, animated: true });
    minuteScrollRef.current?.scrollTo({ y: 0, animated: true });
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
          <Text style={styles.headerText}>您和亲人沟通的时间段一般是在？</Text>
        </View>

        <View style={styles.content}> 
          <View style={styles.timeContainer}>
            <View style={styles.timeSelector}>
              <View style={styles.scrollContainer}>
                <ScrollView
                  ref={hourScrollRef}
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={itemHeight}
                  decelerationRate="fast"
                  onMomentumScrollEnd={handleHourScroll}
                  contentOffset={{ x: 0, y: selectedHour * itemHeight }}
                >
                  {hours.map((hour, index) => (
                    <View key={hour} style={styles.timeItem}>
                      <Text
                        style={[
                          styles.timeValue,
                          selectedHour === hour && styles.selectedTimeValue,
                        ]}
                      >
                        {hour.toString().padStart(2, "0")}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.selectionIndicator} />
              </View>
              <Text style={styles.timeUnit}>时</Text>
              <View style={styles.scrollContainer}>
                <ScrollView
                  ref={minuteScrollRef}
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={itemHeight}
                  decelerationRate="fast"
                  onMomentumScrollEnd={handleMinuteScroll}
                  contentOffset={{ x: 0, y: selectedMinute * itemHeight }}
                >
                  {minutes.map((minute, index) => (
                    <View key={minute} style={styles.timeItem}>
                      <Text
                        style={[
                          styles.timeValue,
                          selectedMinute === minute && styles.selectedTimeValue,
                        ]}
                      >
                        {minute.toString().padStart(2, "0")}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.selectionIndicator} />
              </View>
              <Text style={styles.timeUnit}>分</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>确定</Text>
            </Pressable>
            <Pressable style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>重置</Text>
            </Pressable>
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
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingTop: height * 0.08,
    paddingHorizontal: width * 0.05,
    // marginBottom: height * 0.05,
    height: height * 0.27,
    alignItems: "center",
    // backgroundColor: "red",
  },
  headerText: {
    fontSize: width * 0.1,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    lineHeight: height * 0.07,
    // backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  content: {
    flex: 1,
    width: width,
  },
  timeContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.05,
    width: width,
    height: height * 0.3,
    // backgroundColor: "blue",
  },
  timeSelector: {
    backgroundColor: "#FFDEE2",
    borderRadius: width * 0.05,
    paddingVertical: height * 0.04,
    paddingHorizontal: width * 0.08,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: width * 0.05,
    minHeight: height * 0.25,
  },
  scrollContainer: {
    position: "relative",
    height: height * 0.18,
    width: width * 0.15,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    height: height * 0.18,
    width: "100%",
  },
  scrollContent: {
    paddingVertical: height * 0.06,
  },
  timeItem: {
    height: height * 0.06,
    justifyContent: "center",
    alignItems: "center",
  },
  timeValue: {
    fontSize: 24,
    color: "#999",
    textAlign: "center",
  },
  selectedTimeValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF69B4",
  },
  selectionIndicator: {
    position: "absolute",
    top: height * 0.06,
    left: 0,
    right: 0,
    height: height * 0.06,
    backgroundColor: "rgba(255, 105, 180, 0.1)",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 105, 180, 0.3)",
    pointerEvents: "none",
  },
  timeUnit: {
    fontSize: width * 0.06,
    color: "#333",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: width * 0.2,
    marginBottom: height * 0.03,
    width: width,
    // backgroundColor: "green",
  },
  confirmButton: {
    backgroundColor: "#B3C1FF",
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.02,
    borderRadius: width * 0.05,
    minWidth: width * 0.25,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: width * 0.05,
    color: "#333",
    fontWeight: "600",
  },
  resetButton: {
    backgroundColor: "#FEC5CD",
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.02,
    borderRadius: width * 0.05,
    minWidth: width * 0.25,
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: width * 0.05,
    color: "#333",
    fontWeight: "600",
  },
  returnButton: {
    height: height * 0.13,
    width: width,
    justifyContent: "center",
    paddingLeft: width * 0.05,
    paddingBottom: height * 0.03,
    // backgroundColor: "yellow",
  },
});
