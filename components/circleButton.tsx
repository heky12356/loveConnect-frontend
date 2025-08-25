import { useAudio } from "@/hook/useAudio";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Dimensions, Pressable, StyleSheet } from "react-native";
const { height, width } = Dimensions.get("window");

const iconSize = width * 0.15;

type Prop = {
  bgColor?: string;
  onRecordingComplete?: (uri: string) => void;
};

export default function CircleButton({ bgColor, onRecordingComplete }: Prop) {
  const { startRecording, stopRecording, isRecording, recording } = useAudio();

  const handlePressIn = async () => {
    try {
      await startRecording();
    } catch (error) {
      console.error('录音开始失败:', error);
    }
  };

  const handlePressOut = async () => {
    try {
      const uri = await stopRecording();
      if (uri && onRecordingComplete) {
        onRecordingComplete(uri);
      }
    } catch (error) {
      console.error('录音结束失败:', error);
    }
  };

  return (
    <Pressable 
      onPressIn={handlePressIn} 
      onPressOut={handlePressOut}
      style={({ pressed }) => [
        style.Button, 
        { 
          backgroundColor: isRecording ? "#ff6b6b" : (bgColor ? bgColor : "white"),
          transform: [{ scale: pressed ? 0.95 : 1 }]
        }
      ]}
    >
      <SimpleLineIcons 
        name="microphone" 
        size={iconSize} 
        color={isRecording ? "white" : "black"} 
      />
    </Pressable>
  );
}

const style = StyleSheet.create({
  Button: {
    height: width * 0.3,
    width: width * 0.3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: width * 0.15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: width * 0.08,
    color: "black",
  },
});
