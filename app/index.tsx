

import CustomButton from '@/components/CustomButton';
import { images } from '@/constants';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {

  const dynamicContainerStyles = {
    marginTop: 20
  };

  const dynamicTextStyles = {
    color: '#393E46',
    fontSize: 18
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={images.landing} style={styles.background}>
         {/* Black overlay with 40% opacity */}
         <View style={styles.overlay} />
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <Text style={styles.logo}>LOGO</Text>
              <Text style={styles.signIn}>
                <Link href="/signin">Sign In</Link>
              </Text>
            </View>
            <CustomButton 
            title="Get Started"
            handlePress={() => router.push('/signup')}
            containerStyles={dynamicContainerStyles}
            textStyles={dynamicTextStyles}/>
          </SafeAreaView>
      </ImageBackground>
      <StatusBar style='light' />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // To Ensure the image scales properly
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'space-between'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontFamily: 'MontserratExtraBold',
  },
  signIn: {
    color: 'white',
    fontFamily: 'MontserratBold',
    fontSize: 20
  }
});
