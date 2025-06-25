import React from 'react';
import { ColorsRevised } from '@/constants/ColorsRevised';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '@/src/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '@/components/ui/CustomButton';
import { icon } from '@/constants/icon';
import { useAuth } from '@/src/context/AuthContext';
import useGetUserTeams from '@/src/hooks/queries/useGetUserTeams';
import { Team } from '@/src/entities/Team';
import TeamCard from '@/components/ui/TeamCard';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
// Calculate the effective carousel item width based on SafeAreaView padding
const HORIZONTAL_PADDING = 20 * 2; // 20 on each side of the safe area
const ITEM_WIDTH = width - HORIZONTAL_PADDING;

export default function ProfileScreen() {
  const { currentTheme } = useContext(ThemeContext);
  const {user} = useAuth();
  const {data: userTeamsData, refetch: refetchUserTeams, isPending: isTeamsLoading, isError: isTeamsError, isRefetching: isTeamsRefetching} = useGetUserTeams(user?.user_id || '')
  
  const domains = user?.interests?.domain.map((interest: any) => interest)
  const subdomains = user?.interests?.subdomain.map((interest: any) => interest)
  const domainTopics = user?.interests?.domainTopics.map((interest: any) => interest)

  const scrollViewRef = useRef<ScrollView>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userTeams, setUserTeams] = useState<Team[]>([])
  const [showBlurOverlay, setShowBlurOverlay] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(user?.profile_picture || null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (userTeamsData?.data) {
      setUserTeams(userTeamsData.data.data)
    }
  }, [userTeamsData])

  useEffect(() => {
    if (showBlurOverlay) {
      // Reset states when modal opens
      setImageLoading(false);
      setImageError(false);
      setImageLoaded(false);
    } else {
      // Reset states when modal closes
      setImageLoading(false);
      setImageError(false);
      setImageLoaded(false);
    }
  }, [showBlurOverlay]);

  const handleRetry = () => {
    refetchUserTeams()
  }

  return (
    <>
    <SafeAreaView style={[styles.container, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.gray}]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.headerContainer}>
          <View>
                <LinearGradient
              colors={['#FBE9D7', '#F6D5F7']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              style={{ height: 120, paddingHorizontal: 20, paddingVertical: 10}}
            >

            </LinearGradient>
          </View>
          <View style={styles.headerImage}>
            {user?.profile_picture ? 
              <TouchableOpacity onPress={() => setShowBlurOverlay(true)}>
                <Image 
                  source={{uri: user.profile_picture}} 
                  style={styles.headerImageUser}
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                  resizeMode="cover"
                  fadeDuration={300}
                />
                {imageLoading && (
                  <View style={styles.imageLoadingOverlay}>
                    <ActivityIndicator size="small" color={ColorsRevised.yellow} />
                  </View>
                )}
              </TouchableOpacity> : 
                icon.user({color: currentTheme === 'dark' ? ColorsRevised.black: ColorsRevised.darkgray, size: 60})
            }
          </View>
          <View style={[styles.headerContent, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.darkgray: ColorsRevised.white}]}>
              <View style={styles.headerContentLeft}>
                {user?.firstName && user?.lastName && <Text style={[styles.fullName, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray}]}>{user?.firstName} {user?.lastName}</Text>}
                <Text style={[styles.username, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray}]}>@{user?.username}</Text>
                {user?.city && user?.country &&
                <View style={styles.locationContainer}> 
                  {icon.pin({color: ColorsRevised.yellow, size: 16})}
                  <Text style={[styles.location, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray}]}>{user?.city}, {user?.country}</Text>
                  </View>}
                {user?.job && <Text style={[styles.job, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray}]}>{user?.job}</Text>}
              </View>
            <View style={styles.headerContentRight}>
              <TouchableOpacity 
                style={styles.editProfileButton} 
                onPress={() => {
                  router.push('/(stack)/edit-profile');
                }}
              >
                <Text style={styles.editProfileButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.settingsButton, {borderColor: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray}]} 
                onPress={() => {
                  router.push('/(stack)/settings');
                }}
              >
                <Text style={[styles.settingsButtonText, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray}]}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={[styles.bioContainer, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.darkgray: ColorsRevised.white}]}>
          <Text style={[styles.bioTextTitle, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray}]}>Bio</Text>
          {user?.bio && <Text style={[styles.bioText, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray}]}>{user?.bio}</Text>}
          {!user?.bio && <View style={styles.emptyStateTextContainer}>
            {icon.sad({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray, size: 50})}
            <Text style={[styles.bioText, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray}]}>No bio</Text>
          </View>
}
        </View>
        <View style={[styles.interestsContainer, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.darkgray: ColorsRevised.white}]}>
          <Text style={[styles.interestsTextTitle, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray}]}>Interests</Text>
          <View style={styles.interestsTextContainer}>
            {!domains && !subdomains && !domainTopics && <View style={styles.emptyStateTextContainer}>
              {icon.sad({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray, size: 50})}
              <Text style={[styles.bioText, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray}]}>No interests</Text>
            </View>}
            {domains && domains.map((domain: any, index: number) => (
              <Text key={`${index}_${domain}`} style={[styles.interestsText, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray, borderWidth: 1, borderColor: ColorsRevised.gray, padding: 10}]}>{domain}</Text>
            ))}
            {subdomains && subdomains.map((subdomain: any, index: number) => (
              <Text key={`${index}_${subdomain}`} style={[styles.interestsText, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray, borderWidth: 1, borderColor: ColorsRevised.gray, padding: 10}]}>{subdomain}</Text>
            ))}
            {domainTopics && domainTopics.map((domainTopic: any, index: number) => (
              <Text key={`${index}_${domainTopic}`} style={[styles.interestsText, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray, borderWidth: 1, borderColor: ColorsRevised.gray, padding: 10}]}>{domainTopic}</Text>
            ))}
          </View>
        </View>
        <View style={[styles.teamsContainer, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.darkgray: ColorsRevised.white}]}>
          <Text style={[styles.teamsTextTitle, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray}]}>Teams</Text>
          <View>
            {isTeamsLoading && <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={ColorsRevised.yellow} />
            </View>}
            {isTeamsError && <View style={styles.emptyStateContainer}>
              <View style={{alignItems: 'center'}}>
                {icon.sad({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray, size: 50})}
              </View>
              <Text style={[styles.emptyStateText, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}]}>
                Error loading teams
              </Text>
              <CustomButton
                title="Retry"
                handlePress={refetchUserTeams}
                isLoading={isTeamsRefetching}
                containerStyles={{
                  width: '100%',
                  backgroundColor: ColorsRevised.yellow,
                  borderRadius: 6,
                  padding: 10,
                }}
                textStyles={{
                  color: ColorsRevised.darkgray,
                  fontSize: 14,
                  fontFamily: 'MontserratSemiBold',
                }}
              />
            </View>}
            {userTeams.length > 0 && (
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
                .map((team: Team, index) => (
                <TeamCard
                  key={`${team._id}-${index}`} 
                  team={team} 
                  cardStyles={{
                    width: ITEM_WIDTH - 20,
                    marginHorizontal: 5
                  }} 
                  screen='dashboard'
                />
              ))}
            </ScrollView>

            {/* Dots Indicator */}
            <View style={styles.dotsContainer}>
              {userTeams.length > 0 ? userTeams.map((team: Team, index) => (
                <View
                  key={`${team._id}-${index}`}
                  style={[
                    styles.dot,
                    currentIndex === index ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              )) :   
               <View style={styles.emptyStateContainer}>
              <View style={{alignItems: 'center'}}>
                {icon.smile({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, size: 50})}
              </View>
              <Text style={[styles.emptyStateText, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}]}>
                No teams found
              </Text>
            </View>}
            </View>
            </View>)}
            {userTeams.length === 0 && !isTeamsLoading && !isTeamsRefetching && <View style={styles.emptyStateContainer}>
              <View style={{alignItems: 'center'}}>
                {icon.smile({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, size: 50})}
              </View>
              <Text style={[styles.emptyStateText, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}]}>
                No teams found
              </Text>
            </View>}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    <Modal
      visible={showBlurOverlay}
      transparent={true}
      animationType="fade"
    >
      {/* <TouchableOpacity 
        style={styles.closeModalButton} 
        onPress={() => {
          setShowBlurOverlay(false);
          setImageLoading(false);
          setImageError(false);
          setImageLoaded(false);
        }}
      >
        {icon.xCircle({color: 'red', size: 24})}
      </TouchableOpacity> */}
      <TouchableOpacity 
        style={styles.blurContainer} 
        activeOpacity={1}
        onPress={() => {
          setShowBlurOverlay(false);
          setImageLoading(false);
          setImageError(false);
          setImageLoaded(false);
        }}
      >
        <BlurView intensity={20} style={styles.blurViewContent} experimentalBlurMethod="dimezisBlurView">
          <TouchableOpacity 
            activeOpacity={1}
            onPress={(e) => {
              // Prevent closing when tapping on the image content
              e.stopPropagation();
            }}
          >
            {modalImage ? (
              <View style={styles.modalImageContainer}>
                <Image 
                  source={{uri: modalImage}} 
                  style={styles.modalImage}
                  onLoadStart={() => {
                    if (showBlurOverlay && !imageLoaded) {
                      setTimeout(() => {
                        if (showBlurOverlay && !imageLoaded) {
                          setImageLoading(true);
                        }
                      }, 100);
                    }
                  }}
                  onLoadEnd={() => {
                    if (showBlurOverlay) {
                      setImageLoading(false);
                      setImageLoaded(true);
                    }
                  }}
                  onError={() => {
                    if (showBlurOverlay) {
                      setImageError(true);
                      setImageLoading(false);
                      setImageLoaded(false);
                    }
                  }}
                  resizeMode="cover"
                  fadeDuration={300}
                />
                {imageLoading && !imageLoaded && (
                  <View style={styles.modalImageLoadingOverlay}>
                    <ActivityIndicator size="large" color={ColorsRevised.yellow} />
                  </View>
                )}
                {imageError && (
                  <View style={styles.modalImageErrorOverlay}>
                    <Text style={{color: 'white', textAlign: 'center', fontSize: 14, fontFamily: 'MontserratSemiBold'}}>Failed to load image</Text>
                    <TouchableOpacity 
                      style={{marginTop: 10, padding: 8, backgroundColor: ColorsRevised.yellow, borderRadius: 5}}
                      onPress={() => {
                        setImageError(false);
                        setImageLoading(true);
                        setImageLoaded(false);
                        // Force reload by adding a timestamp
                        setModalImage(`${user?.profile_picture}?t=${Date.now()}`);
                      }}
                    >
                      <Text style={{color: ColorsRevised.darkgray, fontSize: 14, fontFamily: 'MontserratSemiBold'}}>Retry</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <Text style={{color: 'white', fontSize: 18}}>No image available</Text>
            )}
          </TouchableOpacity>
        </BlurView>
      </TouchableOpacity>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    gap: 20,
  },
  headerContainer: {
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  editProfileButton: {
    backgroundColor: ColorsRevised.yellow,
    borderRadius: 3,
    paddingHorizontal: 20,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
  },
  settingsButton: {
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 20,
    paddingVertical: 7,
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButtonText: {
    fontSize: 12,
    fontFamily: 'MontserratSemiBold',
  },
  editProfileButtonText: {
    color: ColorsRevised.darkgray,
    fontSize: 12,
    fontFamily: 'MontserratSemiBold',
  },
  headerContentLeft: {
    width: '65%',
    gap: 8,
  },
  headerContentRight: {
    width: '35%',
    alignItems: 'flex-end',
    height: 100,
    gap: 10,
  },
  fullName: {
    fontSize: 20,
    fontFamily: 'MontserratBold',
  },
  username: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
  },
  location: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
  },
  job: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
  },
  headerImage: {
    position: 'absolute',
    top: 68,
    left: 20,
    width: 100,
    height: 100,
    zIndex: 1,
  },
  headerImageUser: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bioContainer: {
    padding: 20,
    gap: 10
  },
  bioTextTitle: {
    fontSize: 16,
    fontFamily: 'MontserratBold',
  },
  bioText: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
  },
  interestsContainer: {
    padding: 20,
    gap: 10,
  },
  interestsTextTitle: {
    fontSize: 16,
    fontFamily: 'MontserratBold',
  },
  interestsText: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    borderWidth: 1,
  },
  interestsTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  teamsContainer: {
    padding: 20,
    gap: 10,
    marginBottom: 100,
  },
  teamsTextTitle: {
    fontSize: 16,
    fontFamily: 'MontserratBold',
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
    marginTop: 10,
    flexWrap: 'wrap',
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
    backgroundColor: ColorsRevised.gray,
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
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'MontserratMedium',
    textAlign: 'center'
  },
  emptyStateTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10
  },
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: 250,
    height: 250,
    borderRadius: 200,
  },
  modalImageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    borderRadius: 200,
  },
  modalImageErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 150,
    width: 60,
  },
  closeModalButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  blurViewContent: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
