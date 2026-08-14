import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuthStore, Role } from '../../store/auth.store';
import api from '../../services/api';

const ROLES: { label: string; value: Role }[] = [
  { label: 'Student', value: 'student' },
  { label: 'Parent', value: 'parent' },
  { label: 'Instructor', value: 'instructor' },
  { label: 'Admin', value: 'admin' },
];

export default function LoginScreen() {
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
        role,
      });

      const { access_token, user } = response.data;
      await login(user, access_token);
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#ffffff' }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#4f46e5', textAlign: 'center', marginBottom: 8 }}>
          JoyfulPath
        </Text>
        <Text style={{ fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 32 }}>
          Sign in to your account
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.value}
              onPress={() => setRole(r.value)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: role === r.value ? '#4f46e5' : '#f3f4f6',
              }}
            >
              <Text style={{ color: role === r.value ? '#ffffff' : '#111827', fontWeight: 'bold' }}>
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          placeholder="Username or Email"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            backgroundColor: '#f9fafb',
          }}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
            backgroundColor: '#f9fafb',
          }}
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{
            backgroundColor: '#4f46e5',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>Sign In</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
