import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function LessonsListScreen() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await api.get('/lessons');
        // Filter out published only if needed, backend should handle
        setLessons(response.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#4f46e5" style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#111827' }}>
        Lessons
      </Text>
      <FlatList
        data={lessons}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={{ 
              backgroundColor: '#ffffff', 
              padding: 16, 
              borderRadius: 12, 
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
              <Ionicons name="book" size={24} color="#4f46e5" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>{item.title}</Text>
              <Text style={{ color: '#6b7280', fontSize: 14 }}>{item.xpReward} XP Reward</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
            <Text style={{ marginTop: 16, color: '#6b7280' }}>No lessons available</Text>
          </View>
        )}
      />
    </View>
  );
}
