import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TeamsScreen() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="teamDetails" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'formSheet',
              gestureDirection: 'vertical',
              animation: 'slide_from_bottom',
              sheetGrabberVisible: true,
              sheetCornerRadius: 20,
              sheetElevation: 24,
              sheetExpandsWhenScrolledToEdge: true,
              sheetAllowedDetents: [0.5, 0.75, 1],
              sheetInitialDetentIndex: 0
            }}
          />
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
