import { View, Text, StyleSheet, ViewStyle, StyleProp, ColorValue } from 'react-native'
import React from 'react'
import { Team } from '@/src/services/api'
import { LinearGradient } from 'expo-linear-gradient'

type TeamCardProps = {
    team: Team,
    cardStyles: StyleProp<ViewStyle>
}

const TeamCard = ({team, cardStyles}: TeamCardProps) => {
  // Extract colors from the gradient string
  const colors = team.teamColor
    ?.replace('linear-gradient(0deg, ', '')
    .replace(')', '')
    .split(', ')
    .map(color => color.trim()) as [ColorValue, ColorValue] || ['#000000', '#000000']

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.carouselItem, cardStyles]}
    >
      <Text style={styles.teamName}>{team.name}</Text>
    </LinearGradient>
  )
}

export default TeamCard

const styles = StyleSheet.create({
    carouselItem: {
        height: 140,
        borderRadius: 5,
        padding: 15,
        justifyContent: 'center'
    },
    teamName: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'MontserratMedium'
    }
})