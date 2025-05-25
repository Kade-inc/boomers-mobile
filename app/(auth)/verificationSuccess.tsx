import React, { useState, useCallback } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import { images } from '@/constants';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function VerificationSuccessScreen() {
  const colorScheme = useColorScheme();
  const [isNavigating, setIsNavigating] = useState(false);

  const dynamicTextStyles = {
    fontSize: 16,
    color: '#393E46'
  };

  const dynamicContainerStyles = {
    marginTop: 20
  };

  const handleNavigation = useCallback((path: '/signin') => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push(path);
  }, [isNavigating, router]);

  return (
    <SafeAreaView style={[styles.mainContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.successContainer}>
        <View style={styles.successMiddle}>
          <Image source={images.signupSuccess4x} style={styles.successIcon} />
          <Text style={[styles.mailText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Email Verified Successfully!
          </Text>
          <Text style={[styles.checkEmail, { color: Colors[colorScheme ?? 'light'].text }]}>
            Your email has been verified. You can now sign in to your account.
          </Text>
        </View>
        <CustomButton 
          title="Go to Sign In"
          handlePress={() => handleNavigation('/signin')}
          textStyles={dynamicTextStyles}
          containerStyles={dynamicContainerStyles}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  successContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between'
  },
  successMiddle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  successIcon: {
    width: 100,
    height: 100,
    marginBottom: 20
  },
  mailText: {
    fontFamily: 'MontserratBold',
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center'
  },
  checkEmail: {
    fontFamily: 'MontserratMedium',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20
  }
}); 