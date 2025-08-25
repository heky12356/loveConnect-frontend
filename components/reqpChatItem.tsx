import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Audio } from 'expo-av';
import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");

const iconSize = width * 0.1

type Prop = {
    time?: string,
    uri?: string;
    text?: string;
}

export default function ReqpChatItem({time, uri, text} : Prop) {
    const playAudio = async () => {
        if (!uri) return;
        
        try {
            const { sound } = await Audio.Sound.createAsync({ uri });
            await sound.playAsync();
            
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.error('播放音频失败:', error);
            Alert.alert('错误', '播放音频失败');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.viewBox}>
                {uri ? (
                     <Pressable onPress={playAudio} style={styles.audioContainer}>
                         <SimpleLineIcons name="control-play" size={20} color="black" />
                         <Text style={styles.audioText}>点击播放语音</Text>
                     </Pressable>
                 ) : text ? (
                     <Text style={styles.text}>{text}</Text>
                 ) : (
                     <>
                         <AntDesign name="sound" size={iconSize} color="black" />
                         <Feather name="more-horizontal" size={iconSize} color="black" />
                     </>
                 )}
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
    },
    audioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: width * 0.02,
    },
    audioText: {
         fontSize: width * 0.035,
         color: 'black',
     },
     text: {
         fontSize: width * 0.035,
         color: 'black',
         paddingHorizontal: width * 0.03,
     }
})

