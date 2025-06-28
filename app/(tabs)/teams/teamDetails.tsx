import { router } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function TeamDetailsScreen() {
  return (
   <View>
    <Text>Team Details</Text> 
    <TouchableOpacity onPress={() => router.back()}>
        <Text>Back</Text>
    </TouchableOpacity>
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
