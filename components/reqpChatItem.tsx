import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Audio } from 'expo-av';
import { useState } from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");

const iconSize = width * 0.1

type Prop = {
    time?: string,
    uri?: string;
    text?: string;
}

export default function ReqpChatItem({time, uri, text} : Prop) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState<Audio.Sound>();

    const playAudio = async () => {
        if (!uri) return;
        setIsPlaying(true);
        try {
            console.log("播放");
            const { sound } = await Audio.Sound.createAsync({ uri });
            await sound.playAsync();
            setSound(sound);
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                    setIsPlaying(false);
                }
            });
        } catch (error) {
            console.error('播放音频失败:', error);
            Alert.alert('错误', '播放音频失败');
            setIsPlaying(false);
        }
    };

    const pauseAudio = async () => {
        if (!sound) return;
        setIsPlaying(false);
        try {
            console.log("暂停");
            await sound.pauseAsync();
        } catch (error) {
            console.error('暂停音频失败:', error);
            Alert.alert('错误', '暂停音频失败');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.viewBox}>
                {uri ? (
                     <Pressable onPress={isPlaying ? pauseAudio : playAudio} style={styles.audioContainer}>
                         <SimpleLineIcons name={isPlaying ? "control-pause" : "control-play"} size={width * 0.08} color="black" />
                         {isPlaying ? (
                             <Text style={styles.audioText}>点击停止播放</Text>
                         ) : (
                             <Text style={styles.audioText}>点击播放语音</Text>
                         )}
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
         fontSize: width * 0.05,
         color: 'black',
         fontWeight: '400',
     },
     text: {
         fontSize: width * 0.035,
         color: 'black',
         paddingHorizontal: width * 0.03,
     }
})

