//App.js

// Importing necessary components from React
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import FlashMessage from "react-native-flash-message";

// Importing screens & function
import StartScreen from './Screens/StartScreen';
import HomeScreen from './Screens/HomeScreen';
import MyTeamScreen from './Screens/MyTeam';
import LiveScoreScreen from './Screens/LiveScore';

// Importing Selected Players Context
import { SelectedPlayersProvider } from './Screens/HomeScreen';

// Creating stack navigator and bottom tab navigator
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Defining the stack for initial starting screens (StartScreen and HomeScreen)
function StartStack() {
  return (
    <Stack.Navigator initialRouteName="StartScreen" headerMode="none">
      <Stack.Screen name="StartScreen" component={StartScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// Defining the bottom tab navigator with Home Screen, MyTeam Screen, and LiveScore Screen
function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      tabBarOptions={{
        activeTintColor: '#42f44b',
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="My Team"
        component={MyTeamScreen}
        options={{
          tabBarLabel: 'My Team',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Live Score"
        component={LiveScoreScreen}
        options={{
          tabBarLabel: 'Live Score',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="soccer" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Defining  Main App component that wraps entire navigation structure and its flow
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartStack" headerMode="none">
        <Stack.Screen name="StartStack" component={StartStack} />
        <Stack.Screen name="TabNavigator">
          {() => (
            <SelectedPlayersProvider>
              <TabNavigator />
              {/* FlashMessage for displaying messages at bottom */}
              <FlashMessage position="bottom" />
            </SelectedPlayersProvider>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Exporting the App component as the default export
export default App;
