import AiListAddItemButton from "@/components/aiListAddItemButton";
import ReturnButton from "@/components/returnButton";
import TimeSetItem from "@/components/timeSetItem";
import { useTimeItem } from "@/hook/useTimeItem";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");
const iconStyle = width * 0.1;

interface Item {
  title: string;
  time: string;
}

const Items = [
  {
    title: "起床",
    time: "8:00",
  },
  {
    title: "起床",
    time: "8:00",
  },
  {
    title: "起床",
    time: "8:00",
  },
  {
    title: "起床",
    time: "8:00",
  },
  {
    title: "起床",
    time: "8:00",
  },
  {
    title: "起床",
    time: "8:00",
  },
  {
    title: "起床",
    time: "8:00",
  },
  {
    title: "起床",
    time: "8:00",
  },
  {
    title: "起床",
    time: "8:00",
  },
]

export default function TimingSet() {
  const { items, addItem } = useTimeItem();

  const params = useLocalSearchParams<{
    data: string;
  }>();
  useEffect(() => {
    console.log(params?.data);
    if (params?.data) {
      const data = JSON.parse(decodeURIComponent(params.data));
      // console.log(data.event);
      if (data.event !== "") {
        addItem({
          title: data.event,
          time: data.hour + ":" + data.minute,
        });
      }
    }
    // console.log(items);
  }, []);

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
        <ScrollView 
          style={style.scrollContainer}
          contentContainerStyle={style.content}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item, index) => (
            <TimeSetItem key={index} title={item.title} time={item.time} />
          ))}
          <AiListAddItemButton
            onPress={() => router.push("/(timingSet)/addTimePage")}
            Setwidth={width * 0.82}
          />
        </ScrollView>
        <View style={style.returnButton}>
          <ReturnButton path="/" />
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
  scrollContainer: {
    flex: 1,
    width: width * 0.9,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingTop: height * 0.01,
    paddingBottom: height * 0.02,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: height * 0.01,
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
