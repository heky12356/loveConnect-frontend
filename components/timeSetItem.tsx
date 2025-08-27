import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Dimensions, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
const { height, width } = Dimensions.get("window");
const iconStyle = width * 0.08;
const iconTailStyle = width * 0.03;

type Prop = {
    title: string;
    time: string;
    isEnabled?: boolean;
    onToggle?: () => void;
    onDelete?: () => void;
}

export default function TimeSetItem({title, time, isEnabled = true, onToggle, onDelete}: Prop) {
    return (
        <View style={style.container}>
            <View style={style.icon}>
                <Feather name="sun" size={iconStyle} color="black" />
                <View style={style.iconTail}>
                    <AntDesign name="sound" size={iconTailStyle} color="black" />
                </View>
            </View>
            <View style={style.content}>
                <View style={style.textContainer}>
                    <Text style={style.titleText}>{title}</Text>
                    <Text style={style.timeText}>{time}</Text>
                </View>
                <View style={style.controls}>
                    {onToggle && (
                        <Switch
                            value={isEnabled}
                            onValueChange={onToggle}
                            trackColor={{ false: '#E0E0E0', true: '#FFDEE2' }}
                            thumbColor={isEnabled ? '#FF8A95' : '#FFFFFF'}
                            ios_backgroundColor="#E0E0E0"
                        />
                    )}
                    {onDelete && (
                        <TouchableOpacity onPress={onDelete} style={style.deleteButton}>
                            <MaterialIcons name="delete" size={iconTailStyle * 1.5} color="#FF6B6B" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        height: height * 0.12,
        width: width * 0.8,
        backgroundColor: "#FFFFFF",
        borderRadius: width * 0.045,
        paddingHorizontal: width * 0.03,
        marginVertical: height * 0.005,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    icon: {
        height: width * 0.16,
        width: width * 0.16,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFDEE2",
        borderRadius: width * 0.04,
        position: "relative",
        marginRight: width * 0.04,
    },
    iconTail: {
        position: "absolute",
        top: width * 0.1,
        left: width * 0.1,
        // backgroundColor: "#FFFFFF",
        borderRadius: width * 0.02,
        padding: width * 0.005,
    },
    content: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: width * 0.02,
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
    },
    titleText: {
        fontSize: width * 0.045,
        fontWeight: "600",
        color: "#333333",
        marginBottom: height * 0.005,
    },
    timeText: {
        fontSize: width * 0.065,
        fontWeight: "bold",
        color: "#000000",
    },
    controls: {
        flexDirection: "row",
        alignItems: "center",
        gap: width * 0.03,
    },
    deleteButton: {
        padding: width * 0.02,
        borderRadius: width * 0.02,
        backgroundColor: "#FFF5F5",
    },
    text: {
        fontSize: width * 0.045,
        color: "#333333",
    }
});
