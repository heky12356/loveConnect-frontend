import { Audio } from "expo-av";
import { useState } from "react";

export const useAudio = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [permission, requestPermission] = Audio.usePermissions();

  const getAudioPermission = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }

    if (!permission?.granted) {
      alert("请授权录音权限");
      await requestPermission();
    }
  };

  const startRecording = async () => {
    try {
      await getAudioPermission();
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };
  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);
      return uri; // 返回录音文件路径
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  return {
    startRecording,
    stopRecording,
    isRecording,
    recording,
    getAudioPermission,
  };
};
