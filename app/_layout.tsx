import React from 'react';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast, { BaseToast, ErrorToast, ToastConfigParams }  from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { sendExpoPushToken } from '../services/api';
import { View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet } from 'react-native';
import { useReactQueryDevTools } from '@dev-plugins/react-query';

import ThemeProvider from '@/context/ThemeContext';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

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

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // router.replace('/(auth)/signin');
        router.replace('/');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F8B500" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

function registerForPushNotificationsAsync() {
  return new Promise(async (resolve, reject) => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return reject('Permission not granted');
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      resolve(token);
    } else {
      alert('Must use physical device for Push Notifications');
      reject('Not a physical device');
    }
  });
}

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

  useReactQueryDevTools(queryClient);

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
        style={{ borderLeftColor: '#50C878' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: '400'
        }}
        text2Style={{
          fontSize: 13
        }}
      />
    ),
    error: (props: ToastConfigParams<any>) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: '#DC143C' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: '400'
        }}
        text2Style={{
          fontSize: 13
        }}
      />
    ),
    custom: (props: ToastConfigParams<any>) => (
      <LinearGradient
        colors={['#00989B', '#005E78']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ height: 60, width: '90%', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10}}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>{props.text1}</Text>
        <Text style={{ color: 'white', fontSize: 13, fontWeight: '400' }}>{props.text2}</Text>
      </LinearGradient>
    )
  };

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <InnerRootLayout toastConfig={toastConfig} />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

// Add a type for the prop
interface InnerRootLayoutProps {
  toastConfig: any;
}

function InnerRootLayout({ toastConfig }: InnerRootLayoutProps) {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user && user._id) {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          sendExpoPushToken(user._id, token as string)
            .then(() => console.log('Expo push token sent to backend'))
            .catch(err => console.error('Failed to send push token:', err));
        }
      });
    }
  }, [isAuthenticated, user]);

  return (
    <>
      <RootLayoutNav />
      <StatusBar style="light" />
      <Toast config={toastConfig} />
    </>
  );
}

