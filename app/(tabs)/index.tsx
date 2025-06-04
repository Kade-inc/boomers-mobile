import { StyleSheet, View, Text, ScrollView, Modal, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '@/src/context/ThemeContext';
import { ColorsRevised } from '@/constants/ColorsRevised';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { icon } from '@/constants/icon';
import Slider from '@/components/ui/Slider';
import { SliderData } from '@/data/SliderData';
import CustomButton from '@/components/ui/CustomButton';
import TeamCard from '@/components/ui/TeamCard';
import { useAuth } from '@/src/context/AuthContext';
import useGetUserTeams from '@/src/hooks/queries/useGetUserTeams';
import useRecommendations from '@/src/hooks/queries/useRecommendations';
import useGetChallenges from '@/src/hooks/queries/useGetChallenges';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Challenge, Team } from '@/src/services/api';
import ChallengeCard from '@/components/ui/ChallengeCard';

const { width } = Dimensions.get('window');
// Calculate the effective carousel item width based on SafeAreaView padding
const HORIZONTAL_PADDING = 20 * 2; // 20 on each side of the safe area
const ITEM_WIDTH = width - HORIZONTAL_PADDING;

export default function HomeScreen() {
  const { currentTheme } = useContext(ThemeContext);
  const { user } = useAuth();
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
    },
    {
      id: 4,
      title: 'Team 4',
      description: 'Team 4 description'
    },
    {
      id: 5,
      title: 'Team 5',
      description: 'Team 5 description'
    },
    {
      id: 6,
      title: 'Team 6',
      description: 'Team 6 description'
    },
    {
      id: 7,
      title: 'Team 7',
      description: 'Team 7 description'
    },
    {
      id: 8,
      title: 'Team 8',
      description: 'Team 8 description'
    }
  ]
  const [teamOptionsExpanded, setTeamOptionsExpanded] = useState(false)
  const [challengesOptionsExpanded, setChallengesOptionsExpanded] = useState(false)
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('All')
  const [selectedChallengeFilter, setSelectedChallengeFilter] = useState('All')
  const [userId, setUserId] = useState('')
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const challengeScrollViewRef = useRef<ScrollView>(null);
  const [challengeCurrentIndex, setChallengeCurrentIndex] = useState(0);
  const [userTeams, setUserTeams] = useState<Team[]>([])
  const [recommendations, setRecommendations] = useState<Team[]>([])
  const {data: userTeamsData, refetch: refetchUserTeams, isPending: isTeamsLoading, isError: isTeamsError} = useGetUserTeams(userId)
  const {data: recommendationsData, refetch: refetchRecommendations, isPending: isRecommendationsLoading, isError: isRecommendationsError} = useRecommendations()
  const {data: challengesData, refetch: refetchChallenges, isPending: isChallengesLoading, isError: isChallengesError} = useGetChallenges(userId, true)
  const recommendationsScrollViewRef = useRef<ScrollView>(null);
  const [recommendationsCurrentIndex, setRecommendationsCurrentIndex] = useState(0);
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([])

  useEffect(() => {
    if (userTeamsData?.data) {
      setUserTeams(userTeamsData.data.data.slice(0, 10))
    }
  }, [userTeamsData])

  useEffect(() => {
    if (challengesData?.data?.data) {
      const challenges = challengesData.data.data
      const freshChallenges = challenges
        .filter((challenge) => {
          if (!challenge.due_date) return false;
          const dueDate = new Date(challenge.due_date);
          const now = new Date();
          return dueDate > now;
        })
        .sort((a, b) => {
          const dateA = new Date(a.due_date!);
          const dateB = new Date(b.due_date!);
          return dateA.getTime() - dateB.getTime();
        });
      setChallenges(freshChallenges);
      filterChallenges(freshChallenges);
    }
  }, [challengesData, selectedChallengeFilter])

  const filterChallenges = (challenges: Challenge[]) => {
    let filtered: Challenge[] = []
    switch (selectedChallengeFilter) {
      case 'All':
        filtered = challenges
        break
      case 'Owner':
        filtered = challenges.filter(challenge => challenge.owner_id === user?.user_id)
        break
      case 'Member':
        filtered = challenges.filter(challenge => challenge.owner_id !== user?.user_id)
        break
      default:
        filtered = challenges
    }
    setFilteredChallenges(filtered)
  }

  useEffect(() => {
    console.log("Recommendations data received:", recommendationsData?.data?.data)
    if (recommendationsData?.data?.data) {
      console.log("Setting recommendations to:", recommendationsData.data.data)
      setRecommendations(recommendationsData.data.data)
    }
  }, [recommendationsData])

  useEffect(() => {
    console.log("Recommendations state updated:", recommendations)
  }, [recommendations])

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId')
      setUserId(id || '')
    }
    getUserId()
  }, [])

  const getTeams = async () => {
    refetchUserTeams()
  }


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.gray}]}>
      <View style={styles.headerView}>
              <View>
                <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 24, fontFamily: 'MontserratExtraBold'}}>LOGO</Text>
              </View>
              <View style={styles.headerSubView}>
                {icon.bell({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black})}
                {icon.send({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black})}
              </View>
            </View>
        <ScrollView style={styles.scrollView}>
          <View style={[styles.display]}>

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
              {(isTeamsLoading || isRecommendationsLoading || isChallengesLoading) ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#F8B500" />
                </View>
              ) : isTeamsError ? (
                <View style={styles.loaderContainer}>
                                      <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 20, fontFamily: 'MontserratMedium'}}>Teams</Text>
                  <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 16, fontFamily: 'MontserratSemiBold', textAlign: 'center'}}>Error loading teams</Text>
                </View>
              ) : userTeams.length > 0 ? (
                <>
                    <View style={styles.teamsContainer}>
                <View style={styles.teamsContainerHeader}>
                  <View style={styles.teamsContainerHeaderLeft}>
                    <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 20, fontFamily: 'MontserratMedium'}}>Teams</Text>
                    
                    {!teamOptionsExpanded ? <TouchableOpacity onPress={() => setTeamOptionsExpanded(!teamOptionsExpanded)}>
                      {icon.downCircle({borderRadius: 100, padding: 2, color: '#F8B500', size: 20})}
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => setTeamOptionsExpanded(!teamOptionsExpanded)}>
                      {icon.upCircle({borderRadius: 100, padding: 2, color: '#F8B500', size: 20})}
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
                    <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontFamily: 'MontserratMedium'}}>Filters</Text>
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
                  <View>
            <ScrollView 
              ref={scrollViewRef}
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.carouselContent, {paddingHorizontal: 0}]}
              onMomentumScrollEnd={(event) => {
                const offsetX = event.nativeEvent.contentOffset.x;
                const index = Math.round(offsetX / ITEM_WIDTH);
                setCurrentIndex(index);
              }}
            >
              {userTeams
                .filter(team => {
                  if (selectedTeamFilter === 'All') return true;
                  if (selectedTeamFilter === 'Owner') return team.owner_id === user?.user_id;
                  if (selectedTeamFilter === 'Member') return team.owner_id !== user?.user_id;
                  return true;
                })
                .map((team: Team, index) => (
                <TeamCard 
                  key={`${team._id}-${index}`} 
                  team={team} 
                  cardStyles={{
                    width: ITEM_WIDTH - 20,
                    marginHorizontal: 5
                  }} 
                />
              ))}
            </ScrollView>

            {/* Dots Indicator */}
            <View style={styles.dotsContainer}>
              {userTeams
                .filter(team => {
                  if (selectedTeamFilter === 'All') return true;
                  if (selectedTeamFilter === 'Owner') return team.owner_id === user?.user_id;
                  if (selectedTeamFilter === 'Member') return team.owner_id !== user?.user_id;
                  return true;
                })
                .map((team: Team, index) => (
                <View
                  key={`${team._id}-${index}`}
                  style={[
                    styles.dot,
                    currentIndex === index ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </View>
                {/* <Slider itemList={SliderData}/> */}
              </View>
              <View style={styles.challengesContainer}>
              <View style={styles.teamsContainerHeader}>
                  <View style={styles.teamsContainerHeaderLeft}>
                    <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 20, fontFamily: 'MontserratMedium'}}>Challenges</Text>
                    
                    {!challengesOptionsExpanded ? <TouchableOpacity onPress={() => setChallengesOptionsExpanded(!challengesOptionsExpanded)}>
                      {icon.downCircle({color: '#F8B500', borderRadius: 100, padding: 2, size: 20})}
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => setChallengesOptionsExpanded(!challengesOptionsExpanded)}>
                      {icon.upCircle({color: '#F8B500', borderRadius: 100, padding: 2, size: 20})}
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
                    <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontFamily: 'MontserratMedium'}}>Filters</Text>
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

          <View>
            {isChallengesError ? (
              <View style={styles.loaderContainer}>
                <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 20, fontFamily: 'MontserratMedium'}}>Challenges</Text>
                <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 16, fontFamily: 'MontserratSemiBold', textAlign: 'center'}}>Error loading challenges</Text>
              </View>
            ) : (
              <>
            <ScrollView 
              ref={challengeScrollViewRef}
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
              onMomentumScrollEnd={(event) => {
                const offsetX = event.nativeEvent.contentOffset.x;
                const index = Math.round(offsetX / ITEM_WIDTH);
                setChallengeCurrentIndex(index);
              }}
            >
              {filteredChallenges.map((challenge: Challenge, index) => (
                <ChallengeCard 
                  key={`${challenge._id}-${index}`} 
                  challenge={challenge} 
                  cardStyles={{
                    width: ITEM_WIDTH - 20,
                    marginHorizontal: 5
                  }} 
                />
              ))}
            </ScrollView>

            {/* Dots Indicator */}
            <View style={styles.dotsContainer}>
              {filteredChallenges.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    challengeCurrentIndex === index ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
            </>
            )}
          </View>
                {/* <Slider itemList={SliderData}/> */}
              </View>
                </>
              ) : (<>
              {isRecommendationsError ? (
                <View style={styles.loaderContainer}>
                  <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 20, fontFamily: 'MontserratMedium'}}>Recommendations</Text>
                  <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 16, fontFamily: 'MontserratSemiBold', textAlign: 'center'}}>Error loading recommendations</Text>
                </View>
              ) : (
                <View style={styles.recommendationsContainer}>
                                  <View style={styles.recommendationsContainerBody}>
                  <View style={{alignItems: 'center'}}>{icon.teams({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, size: 50})}</View>
                  <Text style={styles.recommendationsContainerBodyText}>You do not own or belong to any team</Text>
                  <View style={{gap: 10}}>
                  <CustomButton title='Create a Team' handlePress={() => {}} containerStyles={{ backgroundColor: '#000000'}} textStyles={{fontSize: 14, color: 'white'}}/>
                  <CustomButton title='Join a Team' handlePress={() => {}} containerStyles={{width: '100%'}} textStyles={{fontSize: 14}}/>
                  </View>
                </View>
                <View style={styles.recommendationsContainerBody}>
                  <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, fontSize: 16, fontFamily: 'MontserratSemiBold', textAlign: 'center'}}>Recommendations</Text>
                {recommendations.length > 0 ? (
                  <>
                            <ScrollView 
                            ref={recommendationsScrollViewRef}
                            horizontal 
                            pagingEnabled 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={[styles.carouselContent, {paddingHorizontal: 0}]}
                            onMomentumScrollEnd={(event) => {
                              const offsetX = event.nativeEvent.contentOffset.x;
                              const index = Math.round(offsetX / ITEM_WIDTH);
                              setRecommendationsCurrentIndex(index);
                            }}
                          >
                            {recommendations.slice(0, 10)?.map((team: Team, index) => (
                              <TeamCard 
                                key={`${team._id}-${index}`} 
                                team={team} 
                                cardStyles={{
                                  width: ITEM_WIDTH - 30,
                                  marginHorizontal: 0
                                }} 
                              />
                            ))}
                          </ScrollView>
                          <View style={styles.dotsContainer}>
              {recommendations.slice(0, 10)?.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    recommendationsCurrentIndex === index ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
              
            </View>
            <CustomButton title='View All' handlePress={() => {}} containerStyles={{width: '100%', backgroundColor: '#F8B500'}} textStyles={{fontSize: 14, color: ColorsRevised.black}}/>
            </>
                ) : (

                <>
                <View style={styles.recommendationsContainerBody}>
                  <View style={{alignItems: 'center'}}>{icon.teams({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, size: 50})}</View>
                  <Text style={styles.recommendationsContainerBodyText}>You do not own or belong to any team</Text>
                  <View style={{gap: 10}}>
                  <CustomButton title='Create a Team' handlePress={() => {}} containerStyles={{ backgroundColor: '#000000'}} textStyles={{fontSize: 14, color: 'white'}}/>
                  <CustomButton title='Join a Team' handlePress={() => {}} containerStyles={{width: '100%'}} textStyles={{fontSize: 14}}/>
                  </View>
                </View>

                <View style={styles.recommendationsContainerBody}>
                  <Text style={{fontSize: 14, fontFamily: 'MontserratSemiBold', color: ColorsRevised.black, textAlign: 'center'}}>Team Recommendations</Text>
                  <View style={{alignItems: 'center'}}>{icon.smile({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, size: 50})}</View>
                  <Text style={styles.recommendationsContainerBodyText}>No Team Recommendations</Text>
                  <Text style={[styles.recommendationsContainerBodyText, {marginTop: 20, paddingHorizontal: 20}]}>Add interests to get some team recommendations</Text>
                  <CustomButton title='Edit Profile' handlePress={() => {getTeams()}} containerStyles={{width: '100%'}} textStyles={{fontSize: 14}}/>
                </View>
                
                </>)}
                </View>
                </View>)}
                </>)}
            
             
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
    paddingTop: 10,
    paddingHorizontal: 20,
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
    gap: 15
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
    gap: 10
  },
  recommendationsContainerBodyText: {
    fontSize: 13,
    fontFamily: 'MontserratMedium',
    color: ColorsRevised.black,
    textAlign: 'center'
  },
  recommendationsContainerBody: {
    gap: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
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
  },
  carouselContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  carouselItem: {
    width: ITEM_WIDTH,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  carouselBody: {
  },
  dotsContainer: {
    // position: 'absolute',
    // bottom: 10, // Positioning the dot container within the carousel container
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#F8B500',
  },
  inactiveDot: {
    backgroundColor: '#fff',
  },
  separatorDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200
  },
});
