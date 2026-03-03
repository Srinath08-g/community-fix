import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import AdminDashboardScreen from '../screens/official/AdminDashboardScreen';
import AllTicketsScreen from '../screens/official/AllTicketsScreen';
import OfficialTicketDetailScreen from '../screens/official/OfficialTicketDetailScreen';
import { COLORS } from '../utils/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TicketsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AllTickets" component={AllTicketsScreen} />
    <Stack.Screen name="OfficialTicketDetail" component={OfficialTicketDetailScreen} />
  </Stack.Navigator>
);

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    <Stack.Screen name="AllTicketsFromDashboard" component={AllTicketsScreen} />
    <Stack.Screen name="OfficialTicketDetail" component={OfficialTicketDetailScreen} />
  </Stack.Navigator>
);

const OfficialNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.gray,
    }}
  >
    <Tab.Screen
      name="Dashboard"
      component={DashboardStack}
      options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>📊</Text>, tabBarLabel: 'Dashboard' }}
    />
    <Tab.Screen
      name="Tickets"
      component={TicketsStack}
      options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>📋</Text>, tabBarLabel: 'All Tickets' }}
    />
  </Tab.Navigator>
);

export default OfficialNavigator;
