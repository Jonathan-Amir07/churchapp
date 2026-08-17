import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { Ionicons } from '@expo/vector-icons';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  
  // Placeholder gamification stats
  const xp = 1450;
  const level = 6;
  const streak = 4;
  const nextLevelXp = 1700;
  
  const progressPct = (xp / nextLevelXp) * 100;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f3f4f6' }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ backgroundColor: '#4f46e5', borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
          Welcome, {user?.name || 'Student'}!
        </Text>
        <Text style={{ color: '#e0e7ff', fontSize: 16 }}>
          You need {nextLevelXp - xp} more XP to reach Level {level + 1}.
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginRight: 8, alignItems: 'center' }}>
          <Ionicons name="flame" size={32} color="#f59e0b" />
          <Text style={{ fontWeight: 'bold', marginTop: 8 }}>{streak} Days</Text>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>Streak</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginHorizontal: 4, alignItems: 'center' }}>
          <Ionicons name="star" size={32} color="#10b981" />
          <Text style={{ fontWeight: 'bold', marginTop: 8 }}>{xp} XP</Text>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>Total XP</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginLeft: 8, alignItems: 'center' }}>
          <Ionicons name="ribbon" size={32} color="#4f46e5" />
          <Text style={{ fontWeight: 'bold', marginTop: 8 }}>Level {level}</Text>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>Verse Master</Text>
        </View>
      </View>

      <View style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>Level Progress</Text>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>{xp} / {nextLevelXp} XP</Text>
        </View>
        <View style={{ height: 12, backgroundColor: '#e5e7eb', borderRadius: 6, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${progressPct}%`, backgroundColor: '#4f46e5' }} />
        </View>
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, marginTop: 8 }}>Quick Actions</Text>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {[
          { title: 'Explore Lessons', icon: 'book', color: '#4f46e5', bg: '#e0e7ff' },
          { title: 'My Tasks', icon: 'checkbox', color: '#ea580c', bg: '#ffedd5' },
          { title: 'Reading Plan', icon: 'book-outline', color: '#9333ea', bg: '#f3e8ff' },
          { title: 'Rewards', icon: 'gift', color: '#ca8a04', bg: '#fef08a' }
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
