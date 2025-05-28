import { View } from 'react-native'
import React, { useContext } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ColorsRevised } from '@/constants/ColorsRevised'
import { ThemeContext } from '@/src/context/ThemeContext'

const AuthLayout = () => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme === 'dark' ? ColorsRevised.light : ColorsRevised.gray }}>
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
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
    </View>
  )
}

export default AuthLayout