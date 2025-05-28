import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { ProtectedRoute } from '../../src/components/ProtectedRoute';

import { TabBar } from '@/components/ui/TabBar';
import { StatusBar } from 'expo-status-bar';
import { ThemeContext } from '@/src/context/ThemeContext';

export default function TabLayout() {
  const { currentTheme } = useContext(ThemeContext);  
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false
        }}
        tabBar={props => <TabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            
          }}
        />
        <Tabs.Screen
          name="teams"
          options={{
            title: 'Teams',
            
          }}
        />
         <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
   
          }}
        />

         <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
       
          }}
        />
       
      </Tabs> 
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
    </ProtectedRoute>
  );
}
