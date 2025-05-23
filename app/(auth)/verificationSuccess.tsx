import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { images } from '@/constants';
import { authService } from '@/src/services/api';
import Toast from 'react-native-toast-message';

export default function VerificationSuccessScreen() {
  const { email, verificationCode } = useLocalSearchParams<{ email: string; verificationCode: string }>();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (email && verificationCode) {
      verifyAccount();
    }
  }, [email, verificationCode]);

  const verifyAccount = async () => {
    try {
      setIsVerifying(true);
      setErrorMessage(null);
      const response = await authService.verify({
        accountId: email,
        verificationCode
      });

      if (response.success) {
        setIsVerified(true);
      } else {
        setErrorMessage(response.error || 'Failed to verify your account');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'An unexpected error occurred';
      setErrorMessage(errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMsg,
        position: 'bottom',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const dynamicTextStyles = {
    fontSize: 16,
    color: '#393E46'
  }

  const dynamicContainerStyles = {
    marginTop: 20,
    width: '50%' as const
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Text style={styles.logo}>LOGO</Text>
        </View>
  
        <View style={styles.successMiddle}>
          {isVerifying ? (
            <Text style={styles.mailText}>Verifying your account...</Text>
          ) : isVerified ? (
            <>
              <Image source={images.signupSuccess4x} style={styles.successIcon}/>
              <Text style={styles.mailText}>Your Boomers account has been verified!</Text>
              <CustomButton 
                title="Go to Sign In"
                handlePress={() => router.replace('/signin')}
                textStyles={dynamicTextStyles}
                containerStyles={dynamicContainerStyles}
              />
            </>
          ) : (
            <>
              <Text style={[styles.mailText, styles.errorText]}>{errorMessage}</Text>
              <CustomButton 
                title="Home"
                handlePress={() => router.replace('/')}
                textStyles={dynamicTextStyles}
                containerStyles={dynamicContainerStyles}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  container: {
    padding: 30,
    flex: 1,
    justifyContent: 'center'
  },
  headerView: {
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0
  },
  logo: {
    fontFamily: 'ChangaOne',
    fontSize: 30,
    marginTop: 10,
    color: '#393E46',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'MontserratBold',
    fontSize: 24,
    color: '#393E46',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 18,
    color: '#393E46',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'MontserratMedium',
    fontSize: 16,
    color: '#393E46',
    textAlign: 'center',
    lineHeight: 24,
  },
  successMiddle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  successIcon: {
    width: 100,
    height: 100,
  },
  mailText: {
    fontFamily: 'MontserratSemiBold',
    color: '#393E46',
    fontSize: 17,
    marginTop: 20,
    textAlign: 'center'
  },
  errorText: {
    color: '#EB4335',
    marginBottom: 20
  },
  homeLink: {
    marginTop: 10
  },
  homeLinkText: {
    fontFamily: 'MontserratBold',
    color: '#F8B500',
    fontSize: 16
  }
}); 