import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import DashboardScreen from '../screens/resident/DashboardScreen';
import CreateTicketScreen from '../screens/resident/CreateTicketScreen';
import TicketDetailScreen from '../screens/resident/TicketDetailScreen';
import ProfileScreen from '../screens/resident/ProfileScreen';
import { COLORS } from '../utils/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
  </Stack.Navigator>
);

const ResidentNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.gray,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text>, tabBarLabel: 'Home' }}
    />
    <Tab.Screen
      name="RaiseIssue"
      component={CreateTicketScreen}
      options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>➕</Text>, tabBarLabel: 'Raise Issue' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text>, tabBarLabel: 'Profile' }}
    />
  </Tab.Navigator>
);

export default ResidentNavigator;
