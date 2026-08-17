import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import api from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function LeaderboardScreen() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Mock analytics or leaderboard endpoint
        // Web uses /api/analytics
        const response = await api.get('/analytics');
        if (response.data && response.data.topStudents) {
           setStudents(response.data.topStudents);
        } else {
           // Fallback mock if data format changes
           setStudents([
             { id: '1', displayName: 'David S.', xpTotal: 2500, level: 8 },
             { id: '2', displayName: 'Mary A.', xpTotal: 2100, level: 7 },
             { id: '3', displayName: 'John M.', xpTotal: 1800, level: 6 },
           ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#f59e0b" style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#111827', textAlign: 'center' }}>
        Leaderboard
      </Text>
      
      <View style={{ backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', elevation: 2 }}>
        <FlatList
          data={students}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                padding: 16,
                borderBottomWidth: index === students.length - 1 ? 0 : 1,
                borderBottomColor: '#f3f4f6'
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: index < 3 ? '#f59e0b' : '#6b7280', width: 30, textAlign: 'center' }}>
                {index + 1}
              </Text>
              
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center', marginHorizontal: 12 }}>
                <Ionicons name="person" size={20} color="#f59e0b" />
              </View>
              
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>{item.displayName || item.name}</Text>
                <Text style={{ color: '#6b7280', fontSize: 12 }}>Level {item.level}</Text>
              </View>
              
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#10b981' }}>{item.xpTotal} XP</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
