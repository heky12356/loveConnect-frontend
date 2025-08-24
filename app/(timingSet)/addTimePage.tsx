import ReturnButton from "@/components/returnButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");
const iconStyle = width * 0.1;

const IsSetter = ({
  isSound,
  setIsSound,
}: {
  isSound: boolean;
  setIsSound: (isSound: boolean) => void;
}) => {
  const handlePress = () => {
    setIsSound(!isSound);
  };

  return (
    <Pressable style={style.IsSetterView} onPress={handlePress}>
      <View style={
        isSound ? style.smailTailButton : style.smailTailButtonSelected}></View>
    </Pressable>
  );
};

const IsCircle = ({
  isCircle,
  preData,
}: {
  isCircle: boolean;
  preData?: string;
}) => {
  return (
    <Pressable
      onPress={() => {
        router.push(`/(timingSet)/SetCirclePage?circleData=${preData}`);
      }}
      style={isCircle ? style.CircledCircleButton : style.CircleButton}
    >
      <AntDesign name="rightcircleo" size={iconStyle * 1.1} color="black" />
    </Pressable>
  );
};

export default function AddTimePage() {
  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("01");
  const [day, setDay] = useState("01");
  const [isSound, setIsSound] = useState(false);
  const [isCircle, setIsCircle] = useState(false);
  const [preCircleData, setCirclePreData] = useState("");

  const circleData = useLocalSearchParams<{
    circleData: string;
  }>();

  useEffect(() => {
    if (circleData?.circleData) {
      const parsedData = JSON.parse(decodeURIComponent(circleData.circleData));
      // console.log(parsedData);
      if (parsedData.selectedOption) {
        setIsCircle(true);
        setCirclePreData(circleData.circleData);
      }
    }
  }, []);

  const onHourChange = (text: string) => {
    setHour(text);
  };
  const onMinuteChange = (text: string) => {
    setMinute(text);
  };

  const onYearChange = (text: string) => {
    setYear(text);
  };
  const onMonthChange = (text: string) => {
    setMonth(text);
  };
  const onDayChange = (text: string) => {
    setDay(text);
  };

  const handleConfirm = () => {
    if (year == '0000' || month == '00' || day == '00') {
      Alert.alert("提示", "请输入日期");
      return;
    }
    console.log(year, month, day, hour, minute);
    router.push(`/(timingSet)/timingSet?year=${year}&month=${month}&day=${day}&hour=${hour}&minute=${minute}`)
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
      <View style={style.container}>
        <View style={style.title}>
          <Feather name="watch" size={iconStyle} color="black" />
          <Text style={style.titleText}>定时设置</Text>
        </View>
        <View style={style.content}>
          <View style={style.timeSetterContainer}>
            <TextInput
              style={style.timeNum}
              value={hour}
              onChangeText={onHourChange}
              keyboardType="numeric"
              maxLength={2}
              placeholder="00"
              onBlur={() => {
                if (hour.length === 1) {
                  setHour("0" + hour);
                }
                if (hour.length === 0) {
                  setHour("00");
                }
              }}
            />
            <Text style={style.timeText}>时</Text>
            <TextInput
              style={style.timeNum}
              value={minute}
              onChangeText={onMinuteChange}
              keyboardType="numeric"
              maxLength={2}
              placeholder="00"
              onBlur={() => {
                if (minute.length === 1) {
                  setMinute("0" + minute);
                }
                if (minute.length === 0) {
                  setMinute("00");
                }
              }}
            />
            <Text style={style.timeText}>分</Text>
          </View>
          <View style={style.contentSetterContainer}>
            <View style={style.labelView}>
              <Text style={style.labelText}>事件</Text>
            </View>
            <View style={style.inputView}>
              <TextInput style={style.inputText} placeholder="请输入事件" />
            </View>
          </View>
          <View style={style.contentSetterContainer}>
            <View style={style.labelView}>
              <Text style={style.labelText}>日期</Text>
            </View>
            <View style={style.inputView}>
              <TextInput
                style={style.inputText}
                value={year}
                placeholder="2006"
                keyboardType="numeric"
                maxLength={4}
                onChangeText={onYearChange}
                onBlur={() => {
                  if (year.length === 1) {
                    setYear("0" + year);
                  }
                  if (year.length === 0) {
                    setYear("2025");
                  }
                }}
              />
              <Text style={style.inputText}>年</Text>
              <TextInput
                style={style.inputText}
                value={month}
                onChangeText={onMonthChange}
                placeholder="01"
                keyboardType="numeric"
                maxLength={2}
                onBlur={() => {
                  if (month.length === 1) {
                    setMonth("0" + month);
                  }
                  if (month.length === 0) {
                    setMonth("00");
                  }
                }}
              />
              <Text style={style.inputText}>月</Text>
              <TextInput
                style={style.inputText}
                value={day}
                onChangeText={onDayChange}
                placeholder="01"
                keyboardType="numeric"
                maxLength={2}
                onBlur={() => {
                  if (day.length === 1) {
                    setDay("0" + day);
                  }
                  if (day.length === 0) {
                    setDay("00");
                  }
                }}
              />
              <Text style={style.inputText}>日</Text>
            </View>
          </View>
          <View style={style.IsContainer}>
            <View style={style.longLableView}>
              <Text style={style.labelText}>语音播报</Text>
            </View>
            <IsSetter isSound={isSound} setIsSound={setIsSound} />
          </View>
          <View style={style.IsContainer}>
            <View style={style.longLableView}>
              <Text style={style.labelText}>是否重复</Text>
            </View>
            <IsCircle isCircle={isCircle} preData={preCircleData} />
          </View>
          <Pressable style={style.confirmButton} onPress={handleConfirm}>
            <Text style={style.labelText}>确定</Text>
          </Pressable>
        </View>
        <View style={style.returnButton}>
          <ReturnButton path="/(timingSet)/timingSet" />
        </View>
      </View>
    </LinearGradient>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: height,
    width: width,
    // backgroundColor: "red",
  },
  title: {
    paddingTop: height * 0.05,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.14,
    width: width,
    // backgroundColor: "green",
  },
  titleText: {
    fontSize: width * 0.08,
    // fontWeight: "bold",
    color: "black",
  },
  content: {
    flex: 1,
    paddingTop: height * 0.03,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: width * 0.9,
    gap: height * 0.02,
  },
  timeSetterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: width * 0.05,
    height: height * 0.12,
    width: width * 0.8,
    backgroundColor: "#FFDEE2",
    borderRadius: width * 0.05,
  },
  timeText: {
    fontSize: width * 0.08,
  },
  timeNum: {
    fontSize: width * 0.1,
  },
  contentSetterContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    gap: width * 0.01,
    height: height * 0.08,
    width: width * 0.8,
    // backgroundColor: "red",
  },
  labelView: {
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.08,
    width: width * 0.3,
    backgroundColor: "#FFDEE2",
    borderRadius: width * 0.03,
  },
  labelText: {
    fontSize: width * 0.06,
  },
  inputView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.08,
    width: width * 0.5,
    // backgroundColor: "yellow",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  inputText: {
    fontSize: width * 0.06,
    // lineHeight: height * 0.06,
  },
  IsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: width * 0.1,
    height: height * 0.08,
    width: width * 0.8,
    // backgroundColor: "red",
  },
  longLableView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: width * 0.05,
    height: height * 0.08,
    width: width * 0.4,
    backgroundColor: "#FFDEE2",
    borderRadius: width * 0.03,
  },
  IsSetterView: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: width * 0.05,
    height: height * 0.05,
    width: width * 0.2,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: width * 0.08,
  },
  smailTailButton: {
    position: "absolute",
    right: width * 0.1,
    height: width * 0.08,
    width: width * 0.08,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: width * 0.08,
    backgroundColor: "#BFBFBF",
  },
  smailTailButtonSelected: {
    position: "absolute",
    right: width * 0.01,
    height: width * 0.08,
    width: width * 0.08,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: width * 0.08,
    backgroundColor: "#FFA9A9",
  },
  CircleButton: {
    justifyContent: "center",
    alignItems: "center",
    height: width * 0.14,
    width: width * 0.14,
    backgroundColor: "white",
    borderRadius: width * 0.14,
  },
  CircledCircleButton: {
    justifyContent: "center",
    alignItems: "center",
    height: width * 0.14,
    width: width * 0.14,
    backgroundColor: "#FEEEBD",
    borderRadius: width * 0.14,
  },
  confirmButton: {
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.1,
    width: width * 0.8,
    backgroundColor: "#FFDEE2",
    borderRadius: width * 0.05,
  },
  returnButton: {
    height: height * 0.13,
    width: width,
    justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "orange",
    paddingLeft: width * 0.05,
    paddingBottom: height * 0.03,
  },
});
