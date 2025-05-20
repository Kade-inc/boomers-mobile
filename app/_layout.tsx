import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast, { BaseToast, ErrorToast, ToastConfigParams }  from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, Text, View } from 'react-native';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
    success: (props: ToastConfigParams<any>) => (
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
    error: (props: ToastConfigParams<any>) => (
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
    custom: (props: ToastConfigParams<any>) => (
      <View style={{ height: 60, width: '100%', backgroundColor: 'red' }}>
        <Text>{props.text1}</Text>
        <Text>{props.props?.uuid}</Text>
      </View>
    )
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style="light" />
        <Toast config={toastConfig} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

