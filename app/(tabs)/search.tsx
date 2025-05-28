import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useState } from 'react';
import { ColorsRevised } from '@/constants/ColorsRevised';
import SettingsButton from '@/components/SettingsButton';
import { ThemeContext } from '@/src/context/ThemeContext';

export default function SearchScreen() {
  const { currentTheme, toggleTheme, useSystemTheme, isSystemTheme } = useContext(ThemeContext);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
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
