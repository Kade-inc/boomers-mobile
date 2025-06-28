import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import { ColorsRevised } from '@/constants/ColorsRevised'
import { ThemeContext } from '@/context/ThemeContext'

type SettingsButtonProps = {
    title: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    onPress: () => void;
    isActive: boolean;
}

const SettingsButton = ({ title, icon, onPress, isActive }: SettingsButtonProps) => {
  const { currentTheme } = useContext(ThemeContext);
    return (
    <TouchableOpacity 
      style={[styles.settingButton, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.darkgrayBackground: ColorsRevised.white}]}
      onPress={onPress}>
        <View style={styles.titleWrapper}>
        <MaterialCommunityIcons name={icon} size={20} color={currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black} />
        <Text style={[styles.title, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}]}>{title}</Text>
        </View>
      
        <MaterialCommunityIcons name={isActive ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline"} size={20} color={isActive ? currentTheme === 'dark' ? ColorsRevised.yellow : ColorsRevised.dark : currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}/>
    </TouchableOpacity>
  )
}

export default SettingsButton

const styles = StyleSheet.create({
    settingButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: ColorsRevised.white,
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
    }
})