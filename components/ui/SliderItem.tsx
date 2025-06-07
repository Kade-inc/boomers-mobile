import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ImageSliderType } from '@/data/SliderData'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'

type Props = {
    item: ImageSliderType,
    index: number;
    scrollX: SharedValue<number>
}

const { width } = Dimensions.get('screen')
const SliderItem = ({item, index, scrollX }: Props) => {
  const rnAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value, 
            [(index-1) * width, index * width, (index+1) * width], // input range
            [-width * 0.25, 0, width*0.25], // output range
            Extrapolation.CLAMP
          ),
          
        },
        {
          scale: interpolate(
            scrollX.value,
            [(index-1) * width, index * width, (index+1) * width],
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
          )
        }
      ]
    }
  })
  return (
    <Animated.View style={[styles.itemContainer, rnAnimatedStyle]}>
      <View style={styles.outerContainer}>


      </View>
    </Animated.View>
  )
}

export default SliderItem

const styles = StyleSheet.create({
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        width: width,
    },
    outerContainer: {
        backgroundColor: 'white',
        height: 130,
        width: 280,
        borderRadius: 8,
        justifyContent: 'space-between'
    }
})