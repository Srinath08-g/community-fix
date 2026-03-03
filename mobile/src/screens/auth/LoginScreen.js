import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/colors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('resident');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🏘️</Text>
          <Text style={styles.title}>CommunityFix</Text>
          <Text style={styles.subtitle}>Your community, your responsibility</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Login As</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'resident' && styles.roleButtonActive]}
              onPress={() => setRole('resident')}
            >
              <Text style={[styles.roleButtonText, role === 'resident' && styles.roleButtonTextActive]}>
                🏠 Resident
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === 'official' && styles.roleButtonActive]}
              onPress={() => setRole('official')}
            >
              <Text style={[styles.roleButtonText, role === 'official' && styles.roleButtonTextActive]}>
                🏛️ Official
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
            <Text style={styles.registerText}>
              Don't have an account? <Text style={styles.registerTextBold}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 60 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, marginTop: 8 },
  subtitle: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.dark, marginBottom: 6, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    backgroundColor: COLORS.lightGray,
  },
  roleContainer: { flexDirection: 'row', gap: 12, marginTop: 4 },
  roleButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  roleButtonActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '15' },
  roleButtonText: { fontSize: 15, color: COLORS.gray, fontWeight: '600' },
  roleButtonTextActive: { color: COLORS.primary },
  loginButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
  },
  loginButtonText: { color: COLORS.white, fontSize: 17, fontWeight: 'bold' },
  registerLink: { alignItems: 'center', marginTop: 20 },
  registerText: { color: COLORS.gray, fontSize: 14 },
  registerTextBold: { color: COLORS.primary, fontWeight: 'bold' },
});

export default LoginScreen;
