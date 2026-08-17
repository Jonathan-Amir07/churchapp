import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function EventsListScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#3b82f6" style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#111827' }}>
        Church Events
      </Text>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View 
            style={{ 
              backgroundColor: '#ffffff', 
              padding: 16, 
              borderRadius: 12, 
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <Ionicons name="calendar" size={24} color="#3b82f6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>{item.title}</Text>
                <Text style={{ color: '#6b7280', fontSize: 14 }}>{new Date(item.startDate).toLocaleDateString()}</Text>
              </View>
            </View>
            <TouchableOpacity style={{ backgroundColor: '#f3f4f6', padding: 12, borderRadius: 8, alignItems: 'center' }}>
              <Text style={{ color: '#3b82f6', fontWeight: 'bold' }}>RSVP Now</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
            <Text style={{ marginTop: 16, color: '#6b7280' }}>No upcoming events</Text>
          </View>
        )}
      />
    </View>
  );
}
