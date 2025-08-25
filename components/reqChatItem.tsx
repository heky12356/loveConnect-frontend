import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Audio } from 'expo-av';
import { useState } from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { height, width } = Dimensions.get("window");

const iconSize = width * 0.1

type Prop = {
    time?: string,
    uri?: string,
    text?: string,
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
                        {isPlaying ? (
                            <Text style={styles.audioText}>点击停止播放</Text>
                        ) : (
                            <Text style={styles.audioText}>点击播放语音</Text>
                        )}
                        <SimpleLineIcons name={isPlaying ? "control-pause" : "control-play"} size={width * 0.08}  />
                    </Pressable>
                ) : (
                    <Text style={styles.text}>{text}</Text>
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
        alignItems: 'flex-end',
        paddingRight: width * 0.08,
        paddingLeft: width * 0.2,
        height: height * 0.1,
        width:width,
        // backgroundColor: 'blue',
    },
    viewBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: width * 0.05,
        alignItems: 'center',
        backgroundColor: '#FFDEE2',
        width: width * 0.5,
        height: height * 0.08,
        // paddingRight: width * 0.05,
        borderRadius: width * 0.055,
    },
    time: {
        paddingRight: width * 0.1,
    },
    timeText: {
        fontSize: width * 0.04,
        color: '#545454',
    },
    audioContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: width * 0.02,
        // backgroundColor: 'red',
    },
    audioText: {
        fontSize: width * 0.05,
        color: 'black',
    },
    text: {
        fontSize: width * 0.035,
        color: 'black',
        paddingHorizontal: width * 0.03,
    }
})

