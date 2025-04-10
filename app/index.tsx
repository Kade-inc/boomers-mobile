import { Link, router } from 'expo-router';
import { View, Text, Button, TouchableOpacity } from 'react-native';


export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white font-pblack">
      <Text className="text-3xl">Finesse</Text>
      <Link href="/signup" style={{ color: 'blue'}}>Go to Home</Link>
   
      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}