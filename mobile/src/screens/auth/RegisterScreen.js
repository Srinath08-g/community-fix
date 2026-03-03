import React, { useState, useEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/colors';
import { API_BASE_URL } from '../../utils/constants';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('resident');
  const [communityId, setCommunityId] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/communities`);
      setCommunities(response.data);
      if (response.data.length > 0) setCommunityId(response.data[0].id);
    } catch {
      // communities will remain empty if fetch fails
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !communityId) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, password, role, communityId, flatNumber, phone });
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account 🏘️</Text>
        <Text style={styles.subtitle}>Join your community</Text>

        <TextInput style={styles.input} placeholder="Full Name *" value={name} onChangeText={setName} />
        <TextInput
          style={styles.input}
          placeholder="Email *"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password *"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password *"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Role</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={role} onValueChange={setRole}>
            <Picker.Item label="Resident" value="resident" />
            <Picker.Item label="Official" value="official" />
          </Picker>
        </View>

        <Text style={styles.label}>Community *</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={communityId} onValueChange={setCommunityId}>
            {communities.map((c) => (
              <Picker.Item key={c.id} label={c.name} value={c.id} />
            ))}
          </Picker>
        </View>

        {role === 'resident' && (
          <TextInput
            style={styles.input}
            placeholder="Flat Number (e.g. A-101)"
            value={flatNumber}
            onChangeText={setFlatNumber}
          />
        )}

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
          <Text style={styles.registerButtonText}>{loading ? 'Creating account...' : 'Register'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginTextBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.gray, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.dark, marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    backgroundColor: COLORS.lightGray,
    marginTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 10,
    backgroundColor: COLORS.lightGray,
    overflow: 'hidden',
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
  },
  registerButtonText: { color: COLORS.white, fontSize: 17, fontWeight: 'bold' },
  loginLink: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  loginText: { color: COLORS.gray, fontSize: 14 },
  loginTextBold: { color: COLORS.primary, fontWeight: 'bold' },
});

export default RegisterScreen;
