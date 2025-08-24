import ReturnButton from "@/components/returnButton";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// 定义返回数据的 JSON 结构
interface CirclePageResult {
  selectedOption: RepeatOption | null;
  selectedDays: string[];
  optionLabel: string;
}

const { height, width } = Dimensions.get("window");

type RepeatOption = "once" | "daily" | "workdays" | "custom";

export default function SetCirclePage() {
  const [selectedOption, setSelectedOption] = useState<RepeatOption | null>(
    null
  );
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const preData = useLocalSearchParams<{
    circleData: string;
  }>();

  useEffect(() => {
    // console.log("preData", preData);
    if (preData?.circleData) {
      const data = JSON.parse(decodeURIComponent(preData.circleData));
    //   console.log("circlepage",data);
      setSelectedOption(data.selectedOption);
      setSelectedDays(data.selectedDays);
    }
  }, []);

  const options = [
    { key: "once" as RepeatOption, label: "仅一次" },
    { key: "daily" as RepeatOption, label: "每天" },
    { key: "workdays" as RepeatOption, label: "法定工作日" },
    { key: "custom" as RepeatOption, label: "自定义" },
  ];

  const weekDays = [
    { key: "sunday", label: "日" },
    { key: "monday", label: "一" },
    { key: "tuesday", label: "二" },
    { key: "wednesday", label: "三" },
    { key: "thursday", label: "四" },
    { key: "friday", label: "五" },
    { key: "saturday", label: "六" },
  ];

  const handleOptionSelect = (option: RepeatOption) => {
    setSelectedOption(option);
    if (option !== "custom") {
      setSelectedDays([]);
    }
    console.log("选择的重复选项:", option);
  };

  // 获取选项的中文标签
  const getOptionLabel = (option: RepeatOption | null): string => {
    if (!option) return "";
    const found = options.find((opt) => opt.key === option);
    return found ? found.label : "";
  };

  // 创建返回路径，包含选择的数据
  const createReturnPath = (): string => {
    const result: CirclePageResult = {
      selectedOption,
      selectedDays,
      optionLabel: getOptionLabel(selectedOption),
    };

    const jsonData = JSON.stringify(result);
    return `/(timingSet)/addTimePage?circleData=${encodeURIComponent(
      jsonData
    )}`;
  };

  const handleDaySelect = (dayKey: string) => {
    setSelectedDays((prev) => {
      if (prev.includes(dayKey)) {
        return prev.filter((day) => day !== dayKey);
      } else {
        return [...prev, dayKey];
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>是否重复</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={styles.optionItem}
              onPress={() => handleOptionSelect(option.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{option.label}</Text>
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioButton,
                    selectedOption === option.key && styles.radioButtonSelected,
                  ]}
                >
                  {selectedOption === option.key && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {selectedOption === "custom" && (
          <View style={styles.customDaysContainer}>
            <View style={styles.daysGrid}>
              {weekDays.map((day) => (
                <TouchableOpacity
                  key={day.key}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day.key) && styles.dayButtonSelected,
                  ]}
                  onPress={() => handleDaySelect(day.key)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDays.includes(day.key) &&
                        styles.dayButtonTextSelected,
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.returnButton}>
        <ReturnButton path={createReturnPath()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: height * 0.05,
    height: height * 0.15,
    width: width,
  },
  titleText: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#333",
  },
  contentContainer: {
    flex: 1,
    width: width,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  optionsContainer: {
    backgroundColor: "#FFE9E9",
    borderRadius: width * 0.1,
    padding: width * 0.04,
    gap: height * 0.01,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.03,
  },
  optionText: {
    fontSize: width * 0.08,
    color: "#333",
    fontWeight: "400",
  },
  radioContainer: {
    padding: width * 0.01,
  },
  radioButton: {
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.04,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5,
  },
  radioButtonSelected: {
    borderColor: "#333",
  },
  radioButtonInner: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: width * 0.05,
    backgroundColor: "#FEADB4",
  },
  returnButton: {
    height: height * 0.13,
    width: width,
    justifyContent: "center",
    paddingLeft: width * 0.05,
    paddingBottom: height * 0.03,
  },
  customDaysContainer: {
    marginTop: height * 0.03,
    paddingHorizontal: width * 0.07,
    backgroundColor: "#F4EFEF",
    borderRadius: width * 0.04,
    padding: width * 0.04,
    gap: height * 0.01,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent: "center",
    gap: width * 0.05,
    // backgroundColor: "white",
  },
  dayButton: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.15,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  dayButtonSelected: {
    backgroundColor: "#FFC9C9",
  },
  dayButtonText: {
    fontSize: width * 0.07,
    lineHeight: width * 0.15,
    fontWeight: "400",
    color: "#333",
  },
  dayButtonTextSelected: {
    color: "#FF6E6E",
    fontWeight: "600",
  },
});
