import { Dimensions, Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get("window");

type Prop = {
    name?: string;
    img?: ImageSourcePropType;
}

export default function AiListItem({name, img}: Prop) {
    return (
        <View style={styles.container}>
            <View style={styles.viewBox}>
                <View style={styles.profile}>
                    <Image source={img} style={styles.profileImg} />
                </View>
                <View style={styles.name}>
                    <Text style={styles.nameText}>{name?name:"name"}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: height * 0.12,
        width: width,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "red",
    },
    viewBox: {
        flexDirection: "row",
        height: height * 0.12,
        width: width * 0.85,
        alignItems: "center",
        backgroundColor: "#E1EAFF",
        borderRadius: width * 0.05,
        gap: width * 0.1,
    }, 
    profile: {
        height: height * 0.11,
        width: height * 0.11,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: height * 0.11,
        marginLeft: width * 0.02,
    },
    profileImg: {
        height: height * 0.1,
        width: height * 0.1,
        borderRadius: height * 0.1,
    },
    name: {
        height: height * 0.12,
        width: width * 0.4,
        justifyContent: "center",
        // alignItems: "center",
        // backgroundColor: "yellow",
    },
    nameText: {
        fontSize: height * 0.04,
    }
})

