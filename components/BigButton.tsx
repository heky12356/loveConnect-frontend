import { ReactNode } from "react";
import { Text, View, StyleSheet, Dimensions, Pressable } from "react-native";

type Prop = {
  onPress?: () => void;
  label?: string;
  icon?: ReactNode;
  backgroudColor?: string;
};

export default function BigButton({ onPress, label, icon, backgroudColor = 'green' }: Prop) {

  return (
    <Pressable onPress={onPress}>
      <View style={[{ backgroundColor: backgroudColor }, styles.container]}>
        {icon}
        <Text>{label}</Text>
      </View>
    </Pressable>
  );
}
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: width * 0.4,
    width: width * 0.4,
    borderRadius: 10,
  },
});
