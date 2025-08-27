import { useAuth } from '@/contexts/AuthContext';
import { useAuthManager } from '@/hook/useAuthManager';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { updateProfile, changePassword, isLoading } = useAuthManager();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const updateProfileField = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const updatePasswordField = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('权限不足', '需要访问相册权限来选择头像');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      updateProfileField('avatar', result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileData.name.trim()) {
      Alert.alert('提示', '请输入姓名');
      return;
    }

    if (!profileData.email.trim()) {
      Alert.alert('提示', '请输入邮箱地址');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      Alert.alert('提示', '请输入有效的邮箱地址');
      return;
    }

    if (!profileData.phone.trim()) {
      Alert.alert('提示', '请输入手机号码');
      return;
    }

    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(profileData.phone)) {
      Alert.alert('提示', '请输入有效的手机号码');
      return;
    }

    try {
      await updateProfile({
        name: profileData.name.trim(),
        phone: profileData.phone.trim(),
        avatar: profileData.avatar,
      });
      setIsEditing(false);
      Alert.alert('成功', '个人信息已更新');
    } catch (error) {
      Alert.alert('更新失败', error instanceof Error ? error.message : '更新失败，请重试');
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword.trim()) {
      Alert.alert('提示', '请输入当前密码');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('提示', '请输入新密码');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('提示', '新密码长度至少为6位');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('提示', '两次输入的新密码不一致');
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      Alert.alert('成功', '密码已更新');
    } catch (error) {
      Alert.alert('修改失败', error instanceof Error ? error.message : '修改失败，请重试');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      '确认登出',
      '您确定要登出吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (!user) {
    return (
      <LinearGradient colors={['#FFE5E5', '#FFDEE2', '#FFD1DC']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF8A95" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FFE5E5', '#FFDEE2', '#FFD1DC']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={width * 0.07} color="#FF8A95" />
            </TouchableOpacity>
            <Text style={styles.title}>个人资料</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <MaterialIcons
                name={isEditing ? 'close' : 'edit'}
                size={width * 0.06}
                color="#FF8A95"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={isEditing ? handleImagePicker : undefined}
              disabled={!isEditing}
            >
              {profileData.avatar ? (
                <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.defaultAvatar}>
                  <MaterialIcons name="person" size={width * 0.15} color="#FF8A95" />
                </View>
              )}
              {isEditing && (
                <View style={styles.cameraIcon}>
                  <MaterialIcons name="camera-alt" size={width * 0.05} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={width * 0.06} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                placeholder="姓名"
                placeholderTextColor="#999"
                value={profileData.name}
                onChangeText={(value) => updateProfileField('name', value)}
                editable={isEditing}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={width * 0.06} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                placeholder="邮箱地址"
                placeholderTextColor="#999"
                value={profileData.email}
                onChangeText={(value) => updateProfileField('email', value)}
                editable={isEditing}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="phone" size={width * 0.06} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                placeholder="手机号码"
                placeholderTextColor="#999"
                value={profileData.phone}
                onChangeText={(value) => updateProfileField('phone', value)}
                editable={isEditing}
                keyboardType="phone-pad"
              />
            </View>

            {isEditing && (
              <TouchableOpacity
                style={[styles.saveButton, isLoading && styles.disabledButton]}
                onPress={handleSaveProfile}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>保存更改</Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={() => setIsChangingPassword(!isChangingPassword)}
            >
              <MaterialIcons name="lock" size={width * 0.05} color="#FF8A95" />
              <Text style={styles.changePasswordText}>修改密码</Text>
              <MaterialIcons
                name={isChangingPassword ? 'expand-less' : 'expand-more'}
                size={width * 0.06}
                color="#FF8A95"
              />
            </TouchableOpacity>

            {isChangingPassword && (
              <View style={styles.passwordSection}>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="lock" size={width * 0.06} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="当前密码"
                    placeholderTextColor="#999"
                    value={passwordData.currentPassword}
                    onChangeText={(value) => updatePasswordField('currentPassword', value)}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <MaterialIcons name="lock" size={width * 0.06} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="新密码（至少6位）"
                    placeholderTextColor="#999"
                    value={passwordData.newPassword}
                    onChangeText={(value) => updatePasswordField('newPassword', value)}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <MaterialIcons name="lock" size={width * 0.06} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="确认新密码"
                    placeholderTextColor="#999"
                    value={passwordData.confirmPassword}
                    onChangeText={(value) => updatePasswordField('confirmPassword', value)}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.changePasswordSubmitButton, isLoading && styles.disabledButton]}
                  onPress={handleChangePassword}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.changePasswordSubmitText}>确认修改</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <MaterialIcons name="logout" size={width * 0.05} color="#FF6B6B" />
              <Text style={styles.logoutText}>登出</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.05,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: width * 0.04,
    color: '#666',
    marginTop: height * 0.02,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.03,
    paddingTop: height * 0.02,
  },
  backButton: {
    padding: width * 0.02,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: width * 0.02,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: height * 0.04,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    backgroundColor: '#F0F0F0',
  },
  defaultAvatar: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF8A95',
    borderRadius: width * 0.04,
    padding: width * 0.02,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.04,
    marginBottom: height * 0.015,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  inputIcon: {
    marginRight: width * 0.03,
  },
  input: {
    flex: 1,
    fontSize: width * 0.045,
    color: '#333',
  },
  disabledInput: {
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#FF8A95',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    marginVertical: height * 0.02,
    shadowColor: '#FF8A95',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.04,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    marginVertical: height * 0.01,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  changePasswordText: {
    flex: 1,
    fontSize: width * 0.045,
    color: '#FF8A95',
    fontWeight: '500',
    marginLeft: width * 0.03,
  },
  passwordSection: {
    marginTop: height * 0.01,
  },
  changePasswordSubmitButton: {
    backgroundColor: '#FF8A95',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.015,
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  changePasswordSubmitText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.02,
    marginTop: height * 0.03,
  },
  logoutText: {
    fontSize: width * 0.045,
    color: '#FF6B6B',
    fontWeight: '600',
    marginLeft: width * 0.02,
  },
});