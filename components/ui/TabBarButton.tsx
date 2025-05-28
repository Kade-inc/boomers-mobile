import { StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { icon } from '@/constants/icon'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { PlatformPressable } from '@react-navigation/elements'

const TabBarButton = ({onPress, onLongPress,  isFocused, routeName, color, label}: any) => {

    const scale = useSharedValue(0)

    useEffect(() => {
        scale.value = withSpring(typeof isFocused === 'boolean' ? isFocused ? 1 : 0 : isFocused, {
            duration: 350,
        })
    }, [scale, isFocused])

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2])

        const top = interpolate(scale.value, [0, 1], [0, 9])
        return {
            transform: [{
                scale: scaleValue,
            }],
            top
        }
    })

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0])
        return {
            opacity
        }
    })

  return (
    <PlatformPressable
    onPress={onPress}
    onLongPress={onLongPress}
    style={styles.tabBarItem}
  >
    <Animated.View style={animatedIconStyle}>
    {icon[routeName as keyof typeof icon]({
      color: isFocused ? '#393E46' : '#393E46',
    })}
        </Animated.View>
    
    <Animated.Text style={[{ color: isFocused ? '#393E46' : '#393E46', fontSize: 12 }, animatedTextStyle]}>
      {label}
    </Animated.Text>

  </PlatformPressable>
  )
}

const styles = StyleSheet.create({
    tabBarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
      },
});


export default TabBarButton