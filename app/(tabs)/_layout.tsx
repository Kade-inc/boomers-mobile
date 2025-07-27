import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';

import { TabBar } from '@/components/ui/TabBar';
import { StatusBar } from 'expo-status-bar';
import { ThemeContext } from '@/context/ThemeContext';
import { TabBarProvider } from '@/context/TabBarContext';

export default function TabLayout() {
  const { currentTheme } = useContext(ThemeContext);  
  return (
    <ProtectedRoute>
      <TabBarProvider>
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
            name="profile"
            options={{
              title: 'Profile',
         
            }}
          />
         
        </Tabs> 
        <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
      </TabBarProvider>
    </ProtectedRoute>
  );
}
