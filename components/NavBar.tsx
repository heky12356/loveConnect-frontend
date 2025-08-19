import { View, Text, StyleSheet, Dimensions, ViewStyle } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
const { height, width } = Dimensions.get("window");

type Prop = {
  style?: ViewStyle;
};

export default function NavBar({ style }: Prop) {
  return (
    <View style={[styles.navbar, style]}>
      <View style={styles.avatar}>
        <Text>头像</Text>
      </View>
      <View style={styles.content}>
        <Text>用户名</Text>
      </View>
      <View style={styles.util}>
        <EvilIcons name="search" size={30} color="black" style={{backgroundColor:"red"}} />
        <Feather name="more-horizontal" size={24} color="black" style={{marginTop:0, backgroundColor:"red"}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    // backgroundColor: "transparent",
    backgroundColor: "green",
    // borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingTop: height * 0.05,
  },
  avatar: {
    marginLeft: width * 0.05,
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    backgroundColor: "red",
  },
  content: {
    alignItems: "center",
    width: width * 0.55,
    backgroundColor: "blue",
  },
  util: {
    flex: 1,
    flexDirection: "row",
    // justifyContent: "flex-end",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "flex-end",
    marginRight: width * 0.05,
  }
});
