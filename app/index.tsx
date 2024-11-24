import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Home = () => {
  return (
    <View className="h-screen justify-center items-center">
      <Link href="/sign-in">
        <Text className="font-mmedium">Boomers Mobile</Text>
      </Link>
    </View>
  )
}

export default Home