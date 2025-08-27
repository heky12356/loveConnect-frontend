import { useAuthManager } from '@/hook/useAuthManager';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuthManager();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('提示', '请输入邮箱地址');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('提示', '请输入有效的邮箱地址');
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(email.trim());
      Alert.alert(
        '重置密码',
        '密码重置邮件已发送到您的邮箱，请查收并按照邮件中的指示重置密码。',
        [
          { text: '确定', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      Alert.alert('发送失败', error instanceof Error ? error.message : '发送失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={['#FFE5E5', '#FFDEE2', '#FFD1DC']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToLogin}
          >
            <MaterialIcons name="arrow-back" size={width * 0.07} color="#FF8A95" />
          </TouchableOpacity>

          <View style={styles.header}>
            <MaterialIcons name="lock-reset" size={width * 0.2} color="#FF8A95" style={styles.lockIcon} />
            <Text style={styles.title}>忘记密码？</Text>
            <Text style={styles.subtitle}>输入您的邮箱地址，我们将发送重置密码的链接</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={width * 0.06} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="邮箱地址"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={[styles.resetButton, isLoading && styles.disabledButton]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.resetButtonText}>发送重置邮件</Text>
              )}
            </TouchableOpacity>

            <View style={styles.infoContainer}>
              <MaterialIcons name="info" size={width * 0.05} color="#FF8A95" />
              <Text style={styles.infoText}>
                如果您的邮箱地址存在于我们的系统中，您将收到一封包含重置密码链接的邮件。
              </Text>
            </View>

            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={handleBackToLogin}
            >
              <Text style={styles.backToLoginText}>返回登录</Text>
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
    justifyContent: 'center',
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.05,
  },
  backButton: {
    position: 'absolute',
    top: height * 0.06,
    left: width * 0.05,
    zIndex: 1,
    padding: width * 0.02,
  },
  header: {
    alignItems: 'center',
    marginBottom: height * 0.05,
    marginTop: height * 0.05,
  },
  lockIcon: {
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#666',
    textAlign: 'center',
    lineHeight: width * 0.06,
    paddingHorizontal: width * 0.05,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.04,
    marginBottom: height * 0.03,
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
  resetButton: {
    backgroundColor: '#FF8A95',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    marginBottom: height * 0.03,
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
  resetButtonText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8F8',
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    marginBottom: height * 0.03,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8A95',
  },
  infoText: {
    fontSize: width * 0.035,
    color: '#666',
    marginLeft: width * 0.02,
    flex: 1,
    lineHeight: width * 0.05,
  },
  backToLoginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF8A95',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.02,
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#FF8A95',
  },
});