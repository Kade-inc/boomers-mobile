import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignIn = () => {
  return (
    <SafeAreaView className='h-screen px-4 bg-white-100'>
        <View className='items-center'>
            <Text className="font-cregular text-2xl text-secondary">LOGO</Text>
        </View>
        <View className="gap-2">
        <Text className="font-cregular text-2xl text-secondary">SIGN UP</Text>
        <Text className="font-msemibold text-sm text-secondary">Create an account to begin your journey</Text>
        </View>
        
    </SafeAreaView>
  )
}

export default SignIn