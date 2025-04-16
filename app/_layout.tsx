import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast, { BaseToast, ErrorToast }  from 'react-native-toast-message';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, Text, View } from 'react-native';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 400,
  fade: true
})

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ChangaOne: require('../assets/fonts/ChangaOneRegular.ttf'),
    MontserratRegular: require('../assets/fonts/MontserratRegular.ttf'),
    MontserratMedium: require('../assets/fonts/MontserratMedium.ttf'),
    MontserratSemiBold: require('../assets/fonts/MontserratSemiBold.ttf'),
    MontserratBold: require('../assets/fonts/MontserratBold.ttf'),
    MontserratExtraBold: require('../assets/fonts/MontserratExtraBold.ttf'),
    MontserratBlack: require('../assets/fonts/MontserratBlack.ttf')
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: 'pink' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: '400'
        }}
      />
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props) => (
      <ErrorToast
        style={{ borderLeftColor: '#C01212' }}
        {...props}
        text1Style={{
          fontSize: 17
        }}
        text2Style={{
          fontSize: 13
        }}
      />
    ),
    /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
  
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
    tomatoToast: ({ text1, props }) => (
      <View style={{ height: 60, width: '100%', backgroundColor: 'red' }}>
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    )
  };

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="+not-found" /> */}
      
      <StatusBar style="light"/>
      </Stack>
      <Toast config={toastConfig} />
      </>
    // </ThemeProvider>
  );
}

