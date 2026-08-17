import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { Ionicons } from '@expo/vector-icons';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f3f4f6' }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ backgroundColor: '#111827', borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
          Welcome, {user?.name || 'Admin'}!
        </Text>
        <Text style={{ color: '#9ca3af', fontSize: 16 }}>
          Platform Management & Overview
        </Text>
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Management</Text>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {[
          { title: 'Users', icon: 'people', color: '#111827', bg: '#e5e7eb' },
          { title: 'Classes', icon: 'business', color: '#111827', bg: '#e5e7eb' },
          { title: 'Events', icon: 'calendar', color: '#111827', bg: '#e5e7eb' },
          { title: 'Analytics', icon: 'pie-chart', color: '#111827', bg: '#e5e7eb' }
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
