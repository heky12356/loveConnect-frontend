import AiListAddItemButton from "@/components/aiListAddItemButton";
import ReturnButton from "@/components/returnButton";
import TimeSetItem from "@/components/timeSetItem";
import { useTimeManager } from "@/hook/useTimeManager";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");
const iconStyle = width * 0.1;

export default function TimingSet() {
  const { items, addItem, loading, toggleItem, deleteItem } = useTimeManager();

  const params = useLocalSearchParams<{
    data: string;
  }>();
  useEffect(() => {
    const handleNewItem = async () => {
      if (params?.data) {
        try {
          const data = JSON.parse(decodeURIComponent(params.data));
          if (data.event !== "") {
            await addItem({
              title: data.event,
              time: data.hour + ":" + data.minute,
              isEnabled: true,
              repeatType: data.repeatType || 'once',
              selectedDays: data.selectedDays,
              soundEnabled: data.isSound || false,
            });
            // 清除URL参数，避免重复添加
            router.replace('/(timingSet)/timingSet');
          }
        } catch (error) {
          console.error('添加定时项失败:', error);
        }
      }
    };

    handleNewItem();
  }, [params?.data, addItem]);

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
          {loading ? (
            <Text>加载中...</Text>
          ) : (
            items.map((item) => (
              <TimeSetItem 
                 key={item.id} 
                 title={item.title} 
                 time={item.time}
                 isEnabled={item.isEnabled}
                 onToggle={() => toggleItem(item.id)}
                 onDelete={() => deleteItem(item.id)}
               />
            ))
          )}
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
  testButton: {
    position: 'absolute',
    right: width * 0.05,
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  testButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
