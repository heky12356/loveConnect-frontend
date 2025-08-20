import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { Dimensions, StyleSheet, Text, View } from "react-native";
const { height, width } = Dimensions.get("window");
const iconStyle = width * 0.1;
const iconTailStyle = width * 0.05;

type Prop = {
    title: string;
    time: string;
}

export default function TimeSetItem({title, time}: Prop) {
    return (
        <View style={style.container}>
            <View style={style.icon}>
                <Feather name="sun" size={iconStyle} color="black" />
                <View style={style.iconTail}>
                    <AntDesign name="sound" size={iconTailStyle} color="black" />
                </View>
            </View>
            <View style={style.content}>
                <Text style={style.text}>{title}</Text>
                <Text style={style.text}>{time}</Text>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        height: height * 0.1,
        width: width * 0.85,
        // backgroundColor: "blue",
        borderRadius: 10,
        paddingRight: width * 0.01,
        paddingLeft: width * 0.01,
    },
    icon: {
        height: width * 0.2,
        width: width * 0.2,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFDEE2",
        borderRadius: 15,
        position: "relative",
    },
    iconTail: {
        position: "absolute",
        top: width * 0.13,
        left: width * 0.12,
    },
    content: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        borderBottomWidth: 1,
        borderColor: "black",
        height: height * 0.08,
        width: width * 0.61,
        paddingLeft: width * 0.05,
        paddingRight: width * 0.05,
    },
    text: {
        fontSize: width * 0.09,
        width: width * 0.3,
        color: "black",
        // backgroundColor: "red",
    }
});
