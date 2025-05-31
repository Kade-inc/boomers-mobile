import { ActivityIndicator, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { ColorsRevised } from '@/constants/ColorsRevised';
import SettingsButton from '@/components/ui/SettingsButton';
import { ThemeContext } from '@/src/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router} from 'expo-router';
import { useAuth } from '@/src/hooks/queries/useAuth';
import Toast from 'react-native-toast-message';

export default function SearchScreen() {
  const { currentTheme, toggleTheme, useSystemTheme, isSystemTheme } = useContext(ThemeContext);
  const { logout } = useAuth();

  const handleLogOut = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      await logout.mutateAsync({token});
   
      console.log('Logout successful');
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('refreshToken');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to logout',
        position: 'bottom',
        visibilityTime: 3000
      });
      console.error('Error during logout:', error);
    } finally {
      router.push('/signin');
    }
  }
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.gray}]}>
      <View style={styles.subContainer}>
      <Text style={[styles.title, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}]}>Theme Switch</Text>
      <TouchableOpacity style={[styles.button, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.btnDark: ColorsRevised.white}]} onPress={() => {}}>
        <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}}>Dark Mode</Text>
        <Switch 
          value={currentTheme === 'dark'} 
          onValueChange={
            () => 
              toggleTheme(currentTheme === 'dark' ? 'light' : 'dark')
          }
        />
      </TouchableOpacity>
      <Text style={[styles.title, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}]}>Theme Settings</Text>
      <SettingsButton title="Light" icon="lightbulb-on" onPress={() => {toggleTheme('light')}} isActive={!isSystemTheme && currentTheme === 'light'}/>
      <SettingsButton title="Dark" icon="weather-night" onPress={() => {toggleTheme('dark')}} isActive={!isSystemTheme && currentTheme === 'dark'}/>
      <SettingsButton title="System" icon="theme-light-dark" onPress={() => {useSystemTheme()}} isActive={isSystemTheme}/>
      <TouchableOpacity style={[styles.button, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.btnDark: ColorsRevised.white}]} onPress={handleLogOut} disabled={logout.isPending}>
        <Text style={{color: 'red'}}>
          {logout.isPending ? 'Logging Out...' : 'Log Out'}
        </Text>
        {logout.isPending && <ActivityIndicator size="small" color="red" style={{marginLeft: 10}} />}
      </TouchableOpacity>
      </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: ColorsRevised.gray
  },
  subContainer: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ColorsRevised.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  }
});
