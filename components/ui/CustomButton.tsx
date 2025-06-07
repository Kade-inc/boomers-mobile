import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle, ActivityIndicator } from 'react-native'
import React from 'react'


interface CustomButtonProps {
    title: string;
    handlePress: () => void;
    containerStyles?: StyleProp<ViewStyle>;
    textStyles?: StyleProp<TextStyle>;
    isLoading?: boolean;
  }

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading}: CustomButtonProps) => {
  return (
    <TouchableOpacity 
    style={[styles.customButton, containerStyles]}
    onPress={handlePress}
    activeOpacity={0.7}
    disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator color="#393E46" />
      ) : (
        <Text style={[styles.text, textStyles]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

export default CustomButton


const styles = StyleSheet.create({
    customButton: {
       backgroundColor: '#F8B500',
       borderRadius: 6,
       minHeight: 45,
       justifyContent: 'center',
       alignItems: 'center'
    },
    text: {
        fontFamily: 'MontserratSemiBold',
        fontSize: 20
    }
})