import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Colors } from '@/constants/Colors'

const AuthLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <Stack>
        <Stack.Screen 
          name="signin"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="signup"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="forgotPassword"
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen 
          name="resetPassword"
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen 
          name="verifyResetCode"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="verificationSuccess"
          options={{
            headerShown: false
          }}
        />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </View>
  )
}

export default AuthLayout