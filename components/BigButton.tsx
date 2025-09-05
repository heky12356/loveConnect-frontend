import { ReactNode } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");

type Prop = {
  onPress?: () => void;
  label?: string;
  icon?: ReactNode;
  backgroudColor?: string;
  size?: "default" | "large";
};

export default function BigButton({ onPress, label, icon, backgroudColor = 'green', size = 'default' }: Prop) {
  const boxSize = size === 'large' ? width * 0.55 : width * 0.35;
  const labelFontSize = size === 'large' ? width * 0.06 : width * 0.03;

  return (
    <Pressable onPress={onPress}>
      <View style={[{ backgroundColor: backgroudColor, height: boxSize, width: boxSize }, styles.container]}>
        {icon}
        <Text style={[styles.label, { fontSize: labelFontSize }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  label: {
    marginTop: width * 0.02,
    fontWeight: '600',
    color: 'black',
  }
});
