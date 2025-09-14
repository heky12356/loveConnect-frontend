import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { getUploadManager } from './uploadManager';
import { config } from './config';

// API基础URL配置 - 使用统一的配置文件
const API_BASE_URL = config.api.baseUrl;

// 图片上传响应接口
interface ImageUploadResponse {
  success: boolean;
  url?: string;
  message?: string;
}

// 图片上传选项接口
interface ImageUploadOptions {
  uri: string;          // 本地图片URI
  fileName?: string;    // 文件名（可选）
  fileType?: string;    // 文件类型（可选）
}

// 获取认证token
const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('@loveConnect:token');
  } catch (error) {
    console.error('获取token失败:', error);
    return null;
  }
};

/**
 * 上传图片到后端服务器
 * @param options 图片上传选项
 * @returns Promise<ImageUploadResponse> 上传结果
 */
export const uploadImage = async (options: ImageUploadOptions): Promise<ImageUploadResponse> => {
  try {
    // 创建File对象（在React Native环境中需要适配）
    const file = {
      uri: options.uri,
      name: options.fileName || 'image.jpg',
      type: options.fileType || 'image/jpeg'
    } as any;
    
    // 使用新的UploadManager
    const uploadManager = getUploadManager();
    const url = await uploadManager.uploadImage(file);
    
    return {
      success: true,
      url: url
    };
  } catch (error) {
    console.error('图片上传错误:', error);
    return {
      success: false,
      message: '网络错误或上传失败'
    };
  }
};

/**
 * 从相册选择并上传图片
 * @returns Promise<ImageUploadResponse> 上传结果
 */
export const pickAndUploadImageFromLibrary = async (): Promise<ImageUploadResponse> => {
  try {
    // 1. 请求相册权限
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return {
        success: false,
        message: '需要相册访问权限'
      };
    }
    
    // 2. 选择图片
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (result.canceled) {
      return { 
        success: false, 
        message: '用户取消选择' 
      };
    }
    
    // 3. 上传选中的图片
    const asset = result.assets[0];
    return await uploadImage({
      uri: asset.uri,
      fileName: asset.fileName || `image_${Date.now()}.jpg`,
      fileType: asset.mimeType || 'image/jpeg'
    });
  } catch (error) {
    console.error('选择图片错误:', error);
    return {
      success: false,
      message: '选择图片失败'
    };
  }
};

/**
 * 拍照并上传图片
 * @returns Promise<ImageUploadResponse> 上传结果
 */
export const takePhotoAndUpload = async (): Promise<ImageUploadResponse> => {
  try {
    // 1. 请求相机权限
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return {
        success: false,
        message: '需要相机访问权限'
      };
    }
    
    // 2. 拍照
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (result.canceled) {
      return { 
        success: false, 
        message: '用户取消拍照' 
      };
    }
    
    // 3. 上传拍摄的图片
    const asset = result.assets[0];
    return await uploadImage({
      uri: asset.uri,
      fileName: `photo_${Date.now()}.jpg`,
      fileType: asset.mimeType || 'image/jpeg'
    });
  } catch (error) {
    console.error('拍照错误:', error);
    return {
      success: false,
      message: '拍照失败'
    };
  }
};

/**
 * 显示图片选择选项（相册或拍照）
 * @returns Promise<ImageUploadResponse> 上传结果
 */
export const showImagePickerOptions = async (): Promise<ImageUploadResponse> => {
  // 这里可以根据需要实现一个选择对话框
  // 暂时默认使用相册选择
  return await pickAndUploadImageFromLibrary();
};

// 导出类型定义供其他文件使用
export type { ImageUploadOptions, ImageUploadResponse };

