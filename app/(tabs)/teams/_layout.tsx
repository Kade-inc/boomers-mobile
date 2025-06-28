import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TeamsScreen() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="teamDetails" options={{ headerShown: false }} />
        </Stack>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
