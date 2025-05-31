import { View,  StyleSheet, LayoutChangeEvent } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabBarButton from './TabBarButton';
import { useContext, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ColorsRevised } from '@/constants/ColorsRevised';
import { ThemeContext } from '@/src/context/ThemeContext';
    



export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const [dimensions, setDimensions] = useState({ width: 100, height: 20 });
    const { currentTheme } = useContext(ThemeContext);
    const buttonWidth = dimensions.width / state.routes.length;

    const onTabBarLayout = (event: LayoutChangeEvent) => {
        setDimensions({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height });
    }

    const tabPositionX = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: tabPositionX.value }]
        }
    })

  return (
    <View style={[styles.tabBar, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.btnDark : ColorsRevised.white}]} onLayout={onTabBarLayout}>
        <Animated.View style={[animatedStyle, {
            position: 'absolute',
            backgroundColor: '#F8B500',
            borderRadius: 30,
            marginHorizontal: 12,
            height: dimensions.height - 15,
            width: buttonWidth - 25
        }]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
            tabPositionX.value = withSpring(index * buttonWidth, {
                duration: 1500,
            })
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
            <TabBarButton
            key={route.name}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            routeName={route.name}
            color={isFocused ? ColorsRevised.dark : currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black}
            label={label}   
            />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1
  },

});