import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { Ionicons } from '@expo/vector-icons';

export default function InstructorDashboard() {
  const { user } = useAuthStore();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f3f4f6' }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ backgroundColor: '#f59e0b', borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
          Welcome, {user?.name || 'Instructor'}!
        </Text>
        <Text style={{ color: '#fef3c7', fontSize: 16 }}>
          Manage your classes, attendance, and lessons.
        </Text>
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Instructor Actions</Text>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {[
          { title: 'Take Attendance', icon: 'qr-code', color: '#10b981', bg: '#d1fae5' },
          { title: 'Manage Lessons', icon: 'book', color: '#3b82f6', bg: '#dbeafe' },
          { title: 'Assignments', icon: 'document-text', color: '#8b5cf6', bg: '#ede9fe' },
          { title: 'My Students', icon: 'people', color: '#f59e0b', bg: '#fef3c7' }
        ].map((action, index) => (
          <TouchableOpacity 
            key={index} 
            style={{ 
              width: '48%', 
              backgroundColor: '#ffffff', 
              borderRadius: 12, 
              padding: 16, 
              marginBottom: 16,
              alignItems: 'center'
            }}
          >
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: action.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Ionicons name={action.icon as any} size={24} color={action.color} />
            </View>
            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
