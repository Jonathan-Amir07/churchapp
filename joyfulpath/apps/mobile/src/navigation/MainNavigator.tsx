import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/auth.store';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import StudentDashboard from '../screens/dashboards/StudentDashboard';
import ParentDashboard from '../screens/dashboards/ParentDashboard';
import InstructorDashboard from '../screens/dashboards/InstructorDashboard';
import AdminDashboard from '../screens/dashboards/AdminDashboard';

// Placeholder Screens until we build them
const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name}</Text>
  </View>
);

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  const { user } = useAuthStore();

  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'student': return StudentDashboard;
      case 'parent': return ParentDashboard;
      case 'instructor': return InstructorDashboard;
      case 'admin':
      case 'priest':
        return AdminDashboard;
      default: return () => <PlaceholderScreen name="Dashboard" />;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'Notifications') iconName = focused ? 'notifications' : 'notifications-outline';
          
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={getDashboardComponent()} />
      <Tab.Screen name="Notifications" component={() => <PlaceholderScreen name="Notifications" />} />
      <Tab.Screen name="Profile" component={() => <PlaceholderScreen name="Profile" />} />
    </Tab.Navigator>
  );
}
