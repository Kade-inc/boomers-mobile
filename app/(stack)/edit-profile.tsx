import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icon } from '@/constants/icon'
import { ColorsRevised } from '@/constants/ColorsRevised'
import { useRouter } from 'expo-router'
import { useContext } from 'react'
import { ThemeContext } from '@/src/context/ThemeContext'
import { StatusBar } from 'expo-status-bar';

const EditProfileScreen = () => {
    const { currentTheme } = useContext(ThemeContext);
    const router = useRouter();
    
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
         <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          {icon.arrowLeft({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black })}
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>
          Edit Profile
        </Text>
      </View>
      <ScrollView>
        <Text>EditProfileScreen</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'MontserratSemiBold',
  },
});