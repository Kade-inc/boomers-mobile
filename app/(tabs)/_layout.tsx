import { Tabs } from 'expo-router';
import React from 'react';
import { ProtectedRoute } from '../../src/components/ProtectedRoute';

import { TabBar } from '@/components/ui/TabBar';

export default function TabLayout() {

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
    </ProtectedRoute>
  );
}
