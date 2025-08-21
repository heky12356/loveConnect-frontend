import ReturnButton from "@/components/returnButton";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";

const { height, width } = Dimensions.get("window");
const iconStyle = width * 0.1;

const IsSetter = () => {
    return (
        <View style={style.IsSetterView}>
            <View style={style.smailTailButton}></View>
        </View>
    )
}

export default function AddTimePage() {
  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");

  const onHourChange = (text: string) => {
    setHour(text);
  };
  const onMinuteChange = (text: string) => {
    setMinute(text);
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
              <TextInput style={style.inputText}
                placeholder="请输入事件"
              />
            </View>
          </View>
          <View style={style.contentSetterContainer}>
            <View style={style.labelView}>
              <Text style={style.labelText}>日期</Text>
            </View>
            <View style={style.inputView}>
              <Text style={style.inputText}>周/天/月</Text>
            </View>
          </View>
          <View style={style.IsContainer}>
            <View style={style.longLableView}>
              <Text style={style.labelText}>语音播报</Text>
            </View>
            <IsSetter />
          </View>
          <View style={style.IsContainer}>
            <View style={style.longLableView}>
              <Text style={style.labelText}>是否重复</Text>
            </View>
            <IsSetter />
          </View>
        </View>
        <View style={style.returnButton}>
          <ReturnButton />
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
    fontSize: width * 0.05,
  },
  inputView: {
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
  longLableView : {
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
    borderWidth: width * 0.01,
    borderColor: "black",
    borderRadius: width * 0.08,
  },
  smailTailButton :{
    position: "absolute",
    right: width * 0.1,
    height: width * 0.06,
    width: width * 0.06,
    borderWidth: width * 0.01,
    borderColor: "black",
    borderRadius: width * 0.08,
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
