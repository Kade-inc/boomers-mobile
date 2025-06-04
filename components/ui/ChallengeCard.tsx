import { View, Text, StyleSheet, ViewStyle, StyleProp, ColorValue } from 'react-native'
import React from 'react'
import { Challenge, Team } from '@/src/services/api'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '@/src/context/AuthContext'

type ChallengeCardProps = {
    challenge: Challenge,
    cardStyles: StyleProp<ViewStyle>
}

const ChallengeCard = ({challenge, cardStyles}: ChallengeCardProps) => {
  const { user } = useAuth()

  const calculateDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysLeft = challenge.due_date ? calculateDaysLeft(challenge.due_date) : null;

  return (
    <LinearGradient
      colors={['#00989B', '#005E78']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.carouselItem, cardStyles]}
    >
      <View style={styles.teamHeader}>
        <Text style={{ color: 'white', fontSize: 14, fontFamily: 'MontserratMedium' }}>{challenge.challenge_name}</Text>
        <Text style={[{ color: 'white', fontSize: 12, fontFamily: 'MontserratMedium' }, styles.teamDefinition]}>{challenge.owner_id === user?.user_id ? 'Owner' : 'Member'}</Text>
      </View>
      <View style={styles.bottomSection}>
      <View style={styles.teamInterests}>
        {/* <Text style={{ color: 'white', fontSize: 12, fontFamily: 'MontserratMedium' }}>{team.subdomain}</Text> */}

        
      </View>
      <View style={styles.challengeBottomSection}>
        <Text style={{ color: 'white', fontSize: 12, fontFamily: 'MontserratMedium' }}>{challenge.difficulty === 1 ? 'Easy' : challenge.difficulty === 2 ? 'Medium' : 'Hard'}</Text>
        <Text style={{ color: 'white', fontSize: 12, fontFamily: 'MontserratMedium' }}>{daysLeft} days left</Text>
      </View>
      </View>
      <View>

      </View>
    </LinearGradient>
  )
}

export default ChallengeCard

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
    challengeBottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    bottomSection: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        gap: 5
    }
})