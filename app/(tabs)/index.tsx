import { Image, StyleSheet, Platform, View, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { useContext } from 'react';
import { ThemeContext } from '@/src/context/ThemeContext';
import { ColorsRevised } from '@/constants/ColorsRevised';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { currentTheme } = useContext(ThemeContext);
  
  return (

    <SafeAreaView style={[styles.container, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.gray}]}>
        <View style={[styles.display, ]}>
          <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}}>Testing stiff</Text>
        </View>
    </SafeAreaView>

  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  display: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }
});
