import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");

const iconSize = width * 0.1

type Prop = {
    time?: string,
}

export default function ReqpChatItem({time} : Prop) {
    return (
        <View style={styles.container}>
            <View style={styles.viewBox}>
                <AntDesign name="sound" size={iconSize} color="black" />
                <Feather name="more-horizontal" size={iconSize} color="black" />
            </View>
            <View style={styles.time}>
                <Text style={styles.timeText}>
                    {time}
                </Text>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        // flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        paddingLeft: width * 0.08,
        paddingRight: width * 0.2,
        height: height * 0.1,
        width:width,
        // backgroundColor: 'blue',
    },
    viewBox: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        gap: width * 0.05,
        alignItems: 'center',
        backgroundColor: '#FFDEE2',
        width: width * 0.7,
        height: height * 0.08,
        paddingLeft: width * 0.05,
        borderRadius: width * 0.055,
    },
    time: {
        paddingLeft: width * 0.1,
    },
    timeText: {
        fontSize: width * 0.04,
        color: '#545454',
    }
})

