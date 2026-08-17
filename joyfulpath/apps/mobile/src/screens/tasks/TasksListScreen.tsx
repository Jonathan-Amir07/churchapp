import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function TasksListScreen() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/homework');
        setTasks(response.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#ea580c" style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#111827' }}>
        My Tasks
      </Text>
      <FlatList
        data={tasks}
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
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#ffedd5', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
              <Ionicons name="checkbox" size={24} color="#ea580c" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>{item.task?.title || 'Assignment'}</Text>
              <Text style={{ color: item.status === 'GRADED' ? '#10b981' : '#f59e0b', fontSize: 14, fontWeight: 'bold' }}>
                {item.status || 'PENDING'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Ionicons name="clipboard-outline" size={48} color="#9ca3af" />
            <Text style={{ marginTop: 16, color: '#6b7280' }}>No tasks available</Text>
          </View>
        )}
      />
    </View>
  );
}
