import { getUploadManager } from '../api/uploadManager';

/**
 * 测试头像上传和图床上传功能
 * 这个文件用于验证上传接口的正确性
 */

// 模拟文件对象（用于测试）
const createMockFile = (name: string, type: string = 'image/jpeg'): File => {
  const blob = new Blob(['mock file content'], { type });
  return new File([blob], name, { type });
};

/**
 * 测试头像上传功能
 */
export const testAvatarUpload = async (): Promise<void> => {
  try {
    console.log('开始测试头像上传...');
    
    const uploadManager = getUploadManager();
    const mockAvatarFile = createMockFile('test-avatar.jpg', 'image/jpeg');
    
    const avatarUrl = await uploadManager.uploadAvatar(mockAvatarFile);
    
    console.log('头像上传成功:', avatarUrl);
    console.log('✅ 头像上传测试通过');
  } catch (error) {
    console.error('❌ 头像上传测试失败:', error);
    throw error;
  }
};

/**
 * 测试图床上传功能
 */
export const testImageUpload = async (): Promise<void> => {
  try {
    console.log('开始测试图床上传...');
    
    const uploadManager = getUploadManager();
    const mockImageFile = createMockFile('test-image.png', 'image/png');
    
    const imageUrl = await uploadManager.uploadImage(mockImageFile);
    
    console.log('图片上传成功:', imageUrl);
    console.log('✅ 图床上传测试通过');
  } catch (error) {
    console.error('❌ 图床上传测试失败:', error);
    throw error;
  }
};

/**
 * 运行所有上传测试
 */
export const runAllUploadTests = async (): Promise<void> => {
  console.log('🚀 开始运行上传功能测试...');
  
  try {
    await testAvatarUpload();
    await testImageUpload();
    
    console.log('🎉 所有上传测试都通过了！');
  } catch (error) {
    console.error('💥 测试过程中出现错误:', error);
    throw error;
  }
};

// 如果直接运行此文件，执行所有测试
if (require.main === module) {
  runAllUploadTests()
    .then(() => {
      console.log('测试完成');
    })
    .catch((error) => {
      console.error('测试失败:', error);
      process.exit(1);
    });
}