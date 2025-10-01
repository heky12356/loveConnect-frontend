import { getAiManager } from "@/api/aiManeger";
import AiListAddItemButton from "@/components/aiListAddItemButton";
import AiListItem from "@/components/aiListItem";
import ReturnButton from "@/components/returnButton";
import { useImg } from "@/hook/useImg";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
const { width, height } = Dimensions.get("window");

const handleAddItemPress = () => {
  router.push("/addAiPage");
};

export default function AiListPage() {
  const [aiList, setAiList] = useState<any>([]);
  const exampleImg = useImg().getImg("001");
  // const exampleImg = require(ImgUri);
  // console.log(exampleImg);
  useEffect(() => {
    async function fetchData() {
      try {
        console.log('开始获取AI列表...');
        const data = await getAiManager().getAiList();
        console.log('获取到的AI数据:', data);
        console.log('AI数据长度:', data?.length || 0);
        setAiList(data || []);
      } catch (error) {
        console.error('获取AI列表失败:', error);
        if (error instanceof Error) {
          console.error('错误详情:', {
            name: error.name,
            message: error.message,
            code: (error as any).code,
            msg: (error as any).msg
          });
        }
        setAiList([]);
      }
    }
    fetchData();
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
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={true}
        >
          {aiList.map((item: any) => (
            <AiListItem
              key={item.id}
              name={item.name}
              img={item.img}
            />
          ))}
          <AiListAddItemButton onPress={handleAddItemPress} />
        </ScrollView>
        <View style={styles.returnButton}>
          <ReturnButton path="/" />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: width * 0.1,
    paddingRight: width * 0.1,
    width: width,
    height: height,
  },
  scrollView: {
    flex: 1,
    width: width,
  },
  content: {
    paddingTop: height * 0.1,
    alignItems: "center",
    minHeight: height * 0.8,
    gap: height * 0.03,
  },
  returnButton: {
    height: height * 0.13,
    width: width,
    justifyContent: "center",
    paddingLeft: width * 0.05,
    paddingBottom: height * 0.03,
  },
});
