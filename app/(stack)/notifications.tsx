import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeContext } from '@/context/ThemeContext';
import { ColorsRevised } from '@/constants/ColorsRevised';
import { icon } from '@/constants/icon';

const Notifications = () => {
    const router = useRouter();
    const { currentTheme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark : ColorsRevised.gray }]}>
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          {icon.arrowLeft({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black })}
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>
          Notifications
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default Notifications

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
        padding: 5,
      },
      headerTitle: {
        fontSize: 20,
        fontFamily: 'MontserratSemiBold',
      }
})