import CircleButton from '@/components/circleButton';
import ReturnButton from '@/components/returnButton';
import TextButton from '@/components/textButton';

import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get("window");

type Prop = {
    path?: string;
    onRecordingComplete?: (uri: string) => void;
}

export default function AiChatButtons({path, onRecordingComplete}: Prop) {
    return (
        <View style={styles.container}>
            <ReturnButton path={path} />
            <CircleButton onRecordingComplete={onRecordingComplete} />
            <TextButton />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: width * 0.1,
        paddingRight: width * 0.1,
        width:width,
    },
})

