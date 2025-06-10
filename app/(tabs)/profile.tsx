import { ColorsRevised } from '@/constants/ColorsRevised';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { ThemeContext } from '@/src/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '@/components/ui/CustomButton';
import { icon } from '@/constants/icon';
import { useAuth } from '@/src/context/AuthContext';

export default function ProfileScreen() {
  const { currentTheme } = useContext(ThemeContext);
  const {user} = useAuth();
  console.log("S: ", user);
  
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.gray}]}>
      <ScrollView>
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
                  <Image source={{uri: user.profile_picture}} style={styles.headerImageUser} /> : 
                    icon.user({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black, size: 60})
                    }
          </View>
          <View style={[styles.headerContent, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.gray: ColorsRevised.white}]}>
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
              <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>
          <Text>BIO</Text>
        </View>
        <View>
          <Text>INTERESTS</Text>
        </View>
        <View>
          <Text>TEAMS</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
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
    right: 0,
    bottom: 0,
    zIndex: 100,
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
  }
});
