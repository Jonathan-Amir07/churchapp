import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function ParentDashboard() {
  const { user } = useAuthStore();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, this would fetch the parent's children
    // e.g. api.get('/students?parentId=' + user.id)
    setTimeout(() => {
      setChildren([
        { id: 1, name: 'David', xp: 1200, level: 5, streak: 3 },
        { id: 2, name: 'Mary', xp: 850, level: 3, streak: 1 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f3f4f6' }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ backgroundColor: '#10b981', borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
          Welcome, {user?.name || 'Parent'}!
        </Text>
        <Text style={{ color: '#ecfdf5', fontSize: 16 }}>
          Track your children's progress and stay connected.
        </Text>
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Your Children</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#10b981" />
      ) : (
        children.map(child => (
          <TouchableOpacity key={child.id} style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#d1fae5', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
              <Ionicons name="person" size={24} color="#10b981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{child.name}</Text>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>Level {child.level} • {child.xp} XP</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>
        ))
      )}

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, marginTop: 8 }}>Parent Actions</Text>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {[
          { title: 'Events', icon: 'calendar', color: '#3b82f6', bg: '#dbeafe' },
          { title: 'Attendance', icon: 'checkmark-circle', color: '#10b981', bg: '#d1fae5' },
          { title: 'Reports', icon: 'bar-chart', color: '#8b5cf6', bg: '#ede9fe' },
        ].map((action, index) => (
          <TouchableOpacity 
            key={index} 
            style={{ 
              width: '31%', 
              backgroundColor: '#ffffff', 
              borderRadius: 12, 
              padding: 12, 
              marginBottom: 16,
              alignItems: 'center'
            }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: action.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Ionicons name={action.icon as any} size={20} color={action.color} />
            </View>
            <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
