import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
    <>
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
    <StatusBar style='dark' />
    </>
  )
}

export default AuthLayout