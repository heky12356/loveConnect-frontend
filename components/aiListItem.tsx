import { router } from 'expo-router';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get("window");

type Prop = {
    name?: string;
    img?: string;
    postNum?: number;
}


interface AiListItemProps {
    name?: string;
    img?: string;
}

export default function AiListItem({name, img, postNum}: Prop) {
    const handlePress = () => {
        const data : AiListItemProps = {
            name,
            img,
        }
        const encodedData = encodeURIComponent(JSON.stringify(data));
        router.push(`/(aiPage)/aiPage?data=${encodedData}`)
    }

    return (
        <View style={styles.container}>
            <Pressable style={styles.viewBox} onPress={handlePress}>
                <View style={styles.profile}>
                    <Image source={{uri: img}} style={styles.profileImg} />
                </View>
                <View style={styles.name}>
                    <Text style={styles.nameText}>{name?name:"name"}</Text>
                </View>
                {postNum?
                <View style={styles.postPot}>
                    <Text style={styles.postNum}>{postNum}</Text>
                </View>
                :null}
            </Pressable>
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
        position: "relative",
        flexDirection: "row",
        height: height * 0.12,
        width: width * 0.85,
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: width * 0.05,
        boxShadow: "0 8px 0 -4px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.15)",
        gap: width * 0.08,
    }, 
    profile: {
        height: height * 0.11,
        width: height * 0.11,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFB2B2",
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
    },
    postPot: {
        position: "absolute",
        // top: height * 0.04,
        right: width * 0.02,
        height: height * 0.08,
        width: height * 0.08,
        borderRadius: height * 0.08,
        backgroundColor: "#FF6A6A",
        justifyContent: "center",
        alignItems: "center",
    },
    postNum: {
        fontSize: width * 0.08,
        color: "white",
    }
})

