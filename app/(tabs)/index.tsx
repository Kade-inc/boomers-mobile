import { StyleSheet, View, Text, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useState } from 'react';
import { ThemeContext } from '@/src/context/ThemeContext';
import { ColorsRevised } from '@/constants/ColorsRevised';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { icon } from '@/constants/icon';
import Slider from '@/components/ui/Slider';
import { SliderData } from '@/data/SliderData';

export default function HomeScreen() {
  const { currentTheme } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);

  const sliderData = [
    {
      id: 1,
      title: 'Team 1',
      description: 'Team 1 description'
    },
    {
      id: 2,
      title: 'Team 2',
      description: 'Team 2 description'
    },
    {
      id: 3,
      title: 'Team 3',
      description: 'Team 3 description'
    }
  ]
  const [teamOptionsExpanded, setTeamOptionsExpanded] = useState(false)
  const [challengesOptionsExpanded, setChallengesOptionsExpanded] = useState(false)
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('All')
  const [selectedChallengeFilter, setSelectedChallengeFilter] = useState('All')

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.gray}]}>
        <ScrollView style={styles.scrollView}>
          <View style={[styles.display]}>
            <View style={styles.headerView}>
              <View>
                <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 24, fontFamily: 'MontserratExtraBold'}}>LOGO</Text>
              </View>
              <View style={styles.headerSubView}>
                {icon.bell({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black})}
                {icon.send({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black})}
              </View>
            </View>
            <View style={styles.headerBottomView}>
              <View style={styles.headerBottomSubView}>
                <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 20, fontFamily: 'MontserratMedium'}}>Hi Paul,</Text>
                <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 18, fontFamily: 'MontserratRegular'}}>Welcome to Boomers</Text>
              </View>
              <View style={styles.headerBottomAdviceView}>
                <TouchableOpacity 
                  style={styles.headerBottomAdviceView} 
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <LinearGradient
                    colors={['#D9436D', '#F26A4B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerBottomAdviceView}
                  >
                    {icon.zap({color: ColorsRevised.white})}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.mainBodyContent}>
              <View style={styles.teamsContainer}>
                <View style={styles.teamsContainerHeader}>
                  <View style={styles.teamsContainerHeaderLeft}>
                    <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 20, fontFamily: 'MontserratMedium'}}>Teams</Text>
                    
                    {!teamOptionsExpanded ? <TouchableOpacity onPress={() => setTeamOptionsExpanded(!teamOptionsExpanded)}>
                      {icon.downCircle({borderRadius: 100, padding: 2, color: '#F8B500'})}
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => setTeamOptionsExpanded(!teamOptionsExpanded)}>
                      {icon.upCircle({borderRadius: 100, padding: 2, color: '#F8B500'})}
                    </TouchableOpacity>}
                    </View>
        
                    <TouchableOpacity style={styles.teamsContainerHeaderMore}>
                      <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 16, fontFamily: 'MontserratMedium'}}>More</Text>
                      {icon.arrowRight({color: currentTheme === 'dark' ? ColorsRevised.black: ColorsRevised.white, backgroundColor: '#F8B500', borderRadius: 100, padding: 2})}
                    </TouchableOpacity>
                </View>
                {teamOptionsExpanded && (
                 
                <View style={styles.teamActionsContainer}>
                  <TouchableOpacity>
                    <Text style={{color: 'white', backgroundColor: '#000000', paddingHorizontal: 15, borderRadius: 2, paddingVertical: 8, fontFamily: 'MontserratMedium', fontSize: 12}}>Create</Text>
                  </TouchableOpacity>
                  <View style={styles.teamsFilters}>
                    <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}}>Filters</Text>
                    <TouchableOpacity onPress={() => setSelectedTeamFilter('All')}>
                      <Text style={[{color: selectedTeamFilter === 'All' ? ColorsRevised.black : currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, backgroundColor: selectedTeamFilter === 'All' ? '#F8B500' : 'transparent', paddingHorizontal: 10, borderRadius: 2, paddingVertical: 8}, {fontFamily: 'MontserratMedium', fontSize: 12}]}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedTeamFilter('Owner')}>
                      <Text style={[{color: selectedTeamFilter === 'Owner' ? ColorsRevised.black : currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, backgroundColor: selectedTeamFilter === 'Owner' ? '#F8B500' : 'transparent', paddingHorizontal: 10, borderRadius: 2, paddingVertical: 8}, {fontFamily: 'MontserratMedium', fontSize: 12}]}>Owner</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedTeamFilter('Member')}>
                      <Text style={[{color: selectedTeamFilter === 'Member' ? ColorsRevised.black : currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, backgroundColor: selectedTeamFilter === 'Member' ? '#F8B500' : 'transparent', paddingHorizontal: 10, borderRadius: 2, paddingVertical: 8}, {fontFamily: 'MontserratMedium', fontSize: 12}]}>Member</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                  )}
                <Slider itemList={SliderData}/>
              </View>
              <View style={styles.challengesContainer}>
              <View style={styles.teamsContainerHeader}>
                  <View style={styles.teamsContainerHeaderLeft}>
                    <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 20, fontFamily: 'MontserratMedium'}}>Challenges</Text>
                    
                    {!challengesOptionsExpanded ? <TouchableOpacity onPress={() => setChallengesOptionsExpanded(!challengesOptionsExpanded)}>
                      {icon.downCircle({color: '#F8B500', borderRadius: 100, padding: 2})}
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => setChallengesOptionsExpanded(!challengesOptionsExpanded)}>
                      {icon.upCircle({color: '#F8B500', borderRadius: 100, padding: 2})}
                    </TouchableOpacity>}
                    </View>
        
                    <TouchableOpacity style={styles.teamsContainerHeaderMore}>
                      <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 16, fontFamily: 'MontserratMedium'}}>More</Text>
                      {icon.arrowRight({color: currentTheme === 'dark' ? ColorsRevised.black: ColorsRevised.white, backgroundColor: '#F8B500', borderRadius: 100, padding: 2})}
                    </TouchableOpacity>
                </View>
                {challengesOptionsExpanded && (
                 
                <View style={styles.teamActionsContainer}>
                  <TouchableOpacity>
                    <Text style={{color: 'white', backgroundColor: '#000000', paddingHorizontal: 15, borderRadius: 2, paddingVertical: 8, fontFamily: 'MontserratMedium', fontSize: 12}}>Create</Text>
                  </TouchableOpacity>
                  <View style={styles.teamsFilters}>
                    <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}}>Filters</Text>
                    <TouchableOpacity onPress={() => setSelectedChallengeFilter('All')}>
                      <Text style={[{color: selectedChallengeFilter === 'All' ? ColorsRevised.black : currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, backgroundColor: selectedChallengeFilter === 'All' ? '#F8B500' : 'transparent', paddingHorizontal: 10, borderRadius: 2, paddingVertical: 8}, {fontFamily: 'MontserratMedium', fontSize: 12}]}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedChallengeFilter('Owner')}>
                      <Text style={[{color: selectedChallengeFilter === 'Owner' ? ColorsRevised.black : currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, backgroundColor: selectedChallengeFilter === 'Owner' ? '#F8B500' : 'transparent', paddingHorizontal: 10, borderRadius: 2, paddingVertical: 8}, {fontFamily: 'MontserratMedium', fontSize: 12}]}>Owner</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedChallengeFilter('Member')}>
                      <Text style={[{color: selectedChallengeFilter === 'Member' ? ColorsRevised.black : currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, backgroundColor: selectedChallengeFilter === 'Member' ? '#F8B500' : 'transparent', paddingHorizontal: 10, borderRadius: 2, paddingVertical: 8}, {fontFamily: 'MontserratMedium', fontSize: 12}]}>Member</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                  )}
                <Slider itemList={SliderData}/>
              </View>
              <View style={styles.recommendationsContainer}></View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={{ flex: 1 }}
            activeOpacity={1} 
            onPress={() => setModalVisible(!modalVisible)}
          >
            <View 
              style={[
                styles.modalContent, 
                { height: '50%' },
                { position: 'absolute', bottom: 0, left: 0, right: 0 }
              ]}
            >
              <View style={styles.modalHandle} />
              <View style={styles.modalBody}>
                {icon.smile({color: ColorsRevised.black, size: 60})}
                <Text style={styles.modalText}>You will always be rewarded for the work you do but not the work you show. Keep pushing forward and strive for greatness.</Text>
                <Text style={styles.modalSubText}>With ❤️ from Advice slip JSON API</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  display: {
    flex: 1,
    gap: 20
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10
  },
  headerSubView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    width: '20%',
  },
  headerBottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
  headerBottomSubView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 5,
    paddingTop: 10
  },
  headerBottomAdviceView: {
    borderRadius: '100%',
    padding: 6,
    overflow: 'hidden'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#999',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    width: '80%',
    textAlign: 'center',
    fontFamily: 'MontserratMedium'
  },
  modalSubText: {
    fontSize: 14,
    fontFamily: 'MontserratMedium',
    color: ColorsRevised.black,
    backgroundColor: '#F8B500',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 50
  },
  mainBodyContent: {

  },
  teamsContainer: {
    gap: 10,
    marginTop: 10
  },
  teamsContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  teamsContainerHeaderMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  teamsContainerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  challengesContainer: {
    gap: 10,
    marginTop: 10
  },
  recommendationsContainer: {

  },
  teamsFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '80%'
  },
  teamActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15
  }
});
