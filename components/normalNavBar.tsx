import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import { Dimensions, StyleSheet, View } from "react-native";
const { height, width } = Dimensions.get("window");

export default function NormalNavBar() {
    return (
        <View style={style.navbar}>
            <AntDesign name="left" size={24} color="black" onPress={()=>{
                router.back()
            }} />
            <Entypo name="menu" size={28} color="black" />
        </View>
    )
}

const style = StyleSheet.create({
    navbar: {
        flexDirection: "row",
        height: height * 0.1,
        width: width,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "none",
        paddingRight: width * 0.1,
        paddingLeft: width * 0.1,
        paddingTop: height * 0.03,

    }
})

