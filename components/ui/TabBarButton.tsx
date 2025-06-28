import { StyleSheet, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { icon } from '@/constants/icon'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
// import { useAuth } from '@/context/AuthContext'

const TabBarButton = ({onPress, onLongPress, isFocused, routeName, color, label}: any) => {
    // const { user } = useAuth();
    const scale = useSharedValue(0)

    useEffect(() => {
        scale.value = withSpring(typeof isFocused === 'boolean' ? isFocused ? 1 : 0 : isFocused, {
            duration: 350,
        })
    }, [scale, isFocused])

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2])
        // const top = routeName === 'profile' && user?.profile_picture 
        //     ? 0  // Keep profile image centered
        //     : interpolate(scale.value, [0, 1], [0, 9])  // Animate other icons
        const top = interpolate(scale.value, [0, 1], [0, 9])  // Animate other icons
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

    const renderIcon = () => {
        // if (routeName === 'profile' && user?.profile_picture) {
        //     return (
        //         <Image 
        //             source={{ uri: user.profile_picture }} 
        //             style={styles.profileImage}
        //         />
        //     );
        // }
        return icon[routeName as keyof typeof icon]({ color });
    }

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
        >
            <Animated.View style={animatedIconStyle}>
                {renderIcon()}
            </Animated.View>
            
            {/* {!(routeName === 'profile' && user?.profile_picture) && (
                <Animated.Text style={[{ color, fontSize: 12, fontFamily: 'MontserratMedium' }, animatedTextStyle]}>
                    {label}
                </Animated.Text>
            )} */}
                <Animated.Text style={[{ color, fontSize: 12, fontFamily: 'MontserratMedium' }, animatedTextStyle]}>
                    {label}
                </Animated.Text>
  
        </Pressable>
    )
}

const styles = StyleSheet.create({
    tabBarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});

export default TabBarButton