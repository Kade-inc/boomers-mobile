import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Linking } from 'react-native';
import React, { useContext } from 'react';
import { Team } from '@/entities/Team';
import { ColorsRevised } from '../../constants/ColorsRevised';
import { icon } from '../../constants/icon';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ColorValue } from 'react-native';
import { ThemeContext } from '@/context/ThemeContext';

type TeamMember = {
  _id: string;
  username: string;
  profile_picture?: string;
};

type ExtendedTeam = Team & {
  members?: TeamMember[];
};

type RecommendationsFormSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  team: ExtendedTeam;
}

const RecommendationsFormSheet = ({ isVisible, onClose, team }: RecommendationsFormSheetProps) => {
  const { user } = useAuth();
  const { currentTheme } = useContext(ThemeContext);

  // Extract colors from the gradient string
  const colors = team.teamColor
    ?.replace('linear-gradient(0deg, ', '')
    .replace(')', '')
    .split(', ')
    .map(color => color.trim()) as [ColorValue, ColorValue] || ['#000000', '#000000']

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <View style={[styles.container, { backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark : ColorsRevised.gray }]}>
          <View style={styles.handle} />
          <ScrollView style={styles.content}>
            <LinearGradient
              colors={colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.header}
            >
              <View style={styles.headerContent}>
                <Text style={styles.teamName}>{team.name}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  {icon.xCircle({ color: ColorsRevised.white })}
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>Owner</Text>
              <View style={styles.ownerInfo}>
                {icon.profile({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black, size: 24 })}
                <Text style={[styles.ownerName, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>{team.owner_id || 'Unknown'}</Text>
              </View>
            </View> */}

            {team.members && team.members.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>House Mates</Text>
                <View style={styles.membersList}>
                  {team.members.slice(1).map((member: TeamMember, index: number) => (
                    <View key={index} style={styles.memberItem}>
                      {icon.profile({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black, size: 20 })}
                      <Text style={[styles.memberName, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>{member.username}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>Specialities</Text>
              <View style={styles.specialities}>
                <Text style={[styles.specialityText, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>{team.domain}</Text>
                <View style={[styles.dot, { backgroundColor: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]} />
                <Text style={[styles.specialityText, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>{team.subdomain}</Text>
                {team.subdomainTopics?.map((topic: string, index: number) => (
                  <React.Fragment key={index}>
                    <View style={[styles.dot, { backgroundColor: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]} />
                    <Text style={[styles.specialityText, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>{topic}</Text>
                  </React.Fragment>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.requestButton} onPress={() => Linking.openURL('http://localhost:5173/')}>
              <Text style={styles.requestButtonText}>Join on CraftHyve Web</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: ColorsRevised.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '65%',
  },
  handle: {
    width: 40,
    height: 0,
    backgroundColor: ColorsRevised.gray,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 0,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    color: ColorsRevised.white,
    fontSize: 24,
    fontFamily: 'MontserratBold',
  },
  closeButton: {
    padding: 5,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: ColorsRevised.gray,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'MontserratSemiBold',
    color: ColorsRevised.black,
    marginBottom: 10,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ownerName: {
    fontSize: 16,
    fontFamily: 'MontserratMedium',
    color: ColorsRevised.black,
  },
  membersList: {
    gap: 10,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  memberName: {
    fontSize: 16,
    fontFamily: 'MontserratMedium',
    color: ColorsRevised.black,
  },
  specialities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 5,
  },
  specialityText: {
    fontSize: 14,
    fontFamily: 'MontserratMedium',
    color: ColorsRevised.black,
  },
  dot: {
    width: 4,
    height: 4,
    backgroundColor: ColorsRevised.black,
    borderRadius: 2,
  },
  requestButton: {
    backgroundColor: ColorsRevised.yellow,
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  requestButtonText: {
    color: ColorsRevised.black,
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
  },
});

export default RecommendationsFormSheet; 