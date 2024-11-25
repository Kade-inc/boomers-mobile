import { View, Text, ScrollView, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignIn = () => {
  return (
    <SafeAreaView className='h-screen px-4 bg-white-100'>
      <ScrollView>
          <View className='items-center'>
              <Text className="font-cregular text-2xl text-secondary">LOGO</Text>
          </View>
          <View className="gap-2">
            <Text className="font-cregular text-2xl text-secondary">SIGN UP</Text>
            <Text className="font-msemibold text-sm text-secondary">Create an account to begin your journey</Text>
          </View>
          {/* Each form field is a view */}
          <View className="gap-2 mt-4">
            <Text className="font-mmedium text-secondary">Email</Text>
            <View className="border border-secondary w-full h-12 px-4 rounded-lg">
              <TextInput 
              className="flex-1 text-secondary font-psemibold"
              value=""
              placeholder="Enter your email"
              placeholderTextColor="#7b7b8b"/>
            </View>
          </View>
          <View className="gap-2 mt-4">
            <Text className="font-mmedium text-secondary">Username</Text>
            <View className="border border-secondary w-full h-12 px-4 rounded-lg">
              <TextInput 
              className="flex-1 text-secondary font-psemibold"
              value=""
              placeholder="Create a username"
              placeholderTextColor="#7b7b8b"/>
            </View>
          </View>
          <View className="gap-2 mt-4">
            <Text className="font-mmedium text-secondary">Password</Text>
            <View className="border border-secondary w-full h-12 px-4 rounded-lg">
              <TextInput 
              className="flex-1 text-secondary font-psemibold"
              value=""
              placeholder="Create a password"
              placeholderTextColor="#7b7b8b"/>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn