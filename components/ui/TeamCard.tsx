import { View, Text, StyleSheet, ViewStyle, StyleProp, ColorValue, TouchableOpacity } from 'react-native'
import React from 'react'
import { Team } from '@/src/entities/Team'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '@/src/context/AuthContext'

type TeamCardProps = {
    team: Team,
    cardStyles: StyleProp<ViewStyle>
    screen: string
    onPress?: () => void
}

const TeamCard = ({team, cardStyles, screen, onPress}: TeamCardProps) => {
  const { user } = useAuth()

  // Extract colors from the gradient string
  const colors = team.teamColor
    ?.replace('linear-gradient(0deg, ', '')
    .replace(')', '')
    .split(', ')
    .map(color => color.trim()) as [ColorValue, ColorValue] || ['#000000', '#000000']

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.carouselItem, cardStyles]}
      >
        <View style={styles.teamHeader}>
          <Text style={{ color: 'white', fontSize: 16, fontFamily: 'MontserratSemiBold' }}>{team.name}</Text>
          {screen === 'dashboard' || screen === 'all-teams' && <Text style={[{ color: 'white', fontSize: 12, fontFamily: 'MontserratMedium' }, styles.teamDefinition]}>{team.owner_id === user?.user_id ? 'Owner' : 'Member'}</Text>}
        </View>
        <View style={styles.bottomSection}>
        <View style={styles.teamInterests}>
          <Text style={{ color: 'white', fontSize: 12, fontFamily: 'MontserratMedium' }}>{team.subdomain}</Text>
          <View style={{ width: 4, height: 4, backgroundColor: 'white', borderRadius: 50 }}></View>
          {team.subdomainTopics && team.subdomainTopics.length > 0 && (
              <>
                  {team.subdomainTopics.slice(0, 2).map((topic, index, array) => (
                      <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                          <Text style={{ color: 'white', fontSize: 12, fontFamily: 'MontserratMedium' }}>{topic}</Text>
                          {index < array.length - 1 && (
                              <View style={{ width: 4, height: 4, backgroundColor: 'white', borderRadius: 50 }}></View>
                          )}
                      </View>
                  ))}

                  {team.subdomainTopics.length > 1 && (
                      <Text style={{ color: 'white', fontSize: 12, fontFamily: 'MontserratMedium' }}>{team.subdomainTopics?.length && team.subdomainTopics?.length > 2 && `+${team.subdomainTopics?.length - 2}`}</Text>
                  )}
              </>
          )}
          
        </View>
        <View>
          <Text style={{ color: 'white', fontSize: 12, fontFamily: 'MontserratMedium' }}>Active ⭐️</Text>
        </View>
        </View>
        <View>

        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

export default TeamCard

const styles = StyleSheet.create({
    carouselItem: {
        height: 140,
        borderRadius: 5,
        padding: 15,
        flex: 1,
        justifyContent: 'space-between',
        position: 'relative'
    },
    teamHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    teamDefinition: {
        borderWidth: 1,
        borderColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 3
    },
    teamInterests: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
        alignItems: 'center'
    },
    bottomSection: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        gap: 5
    }
})