import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'

export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-white h-full">
        <ScrollView contentContainerStyle={{ height: '100%'}}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
         

        
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless Possibilities with{' '}
              <Text className="text-secondary-200">Aora</Text>
            </Text>
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">Where creativity meets innovation: embark on a journey of limitless exploration with Aora</Text>
          <CustomButton
          title="Get Started"
          handlePress={() => router.push('/signin')}
          containerStyles="w-full mt-7 bg-primary rounded-md min-h-[50px]"
          textStyles="text-gray"/>
        </View>
      </ScrollView>
        <StatusBar backgroundColor='#000' style="dark"/>
    </SafeAreaView>
  )
}