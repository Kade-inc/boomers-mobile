import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading}) => {
  return (
    <TouchableOpacity
    className={`justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
    onPress={handlePress}
    activeOpacity={0.7}
    disabled={isLoading}>
      <Text className={`font-psemibold text-lg ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton