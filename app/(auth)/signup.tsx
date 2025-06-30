import React, { useContext, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useForm } from "react-hook-form"
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from '@/components/ui/CustomButton';
import FormInputController from "@/components/controllers/FormInputController";
import { yupResolver } from '@hookform/resolvers/yup'
import { signUpFormSchema } from "@/constants/schemas/authSchemas";
import { Link, router, useFocusEffect } from "expo-router";
import { images } from "@/constants";
import Toast from "react-native-toast-message";
import { useAuth } from "@/hooks/queries/useAuth";
import { Feather } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { ColorsRevised } from '@/constants/ColorsRevised';

interface SignUpFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  source: 'web' | 'mobile';
}

export default function SignupScreen() {
  const { currentTheme } = useContext(ThemeContext);
    const {
      control,
      handleSubmit,
      reset,
      formState: {
        errors
      }
    } = useForm<SignUpFormData>({
      resolver: yupResolver(signUpFormSchema),
      defaultValues: {
        source: 'mobile'
      }
    })

    const [signupSuccess, setSignupSuccess] = useState(false)
    const { register } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Reset form and success state when the screen comes into focus
    useFocusEffect(
      React.useCallback(() => {
        setSignupSuccess(false);
        reset({
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
          source: 'mobile'
        });
      }, [reset])
    );

    const submit = async (data: SignUpFormData) => {
      try {
        setIsLoading(true)
        const response = await register.mutateAsync({
          email: data.email,
          username: data.username,
          password: data.password,
          source: 'mobile'
        })
        if (response.successful) {
          router.push({
            pathname: '/verificationSuccess',
            params: { email: data.email }
          })
        } else {
          showToast('Failed to register')
        }
      } catch (error) {
        console.error("Registration error:", error)
        showToast(error instanceof Error ? error.message : 'Failed to register')
      } finally {
        setIsLoading(false)
      }
    }

    const dynamicTextStyles = {
      fontSize: 16,
      color: ColorsRevised.black
    }

    const dynamicContainerStyles = {
      marginTop: 20
    }

    const inputContainerStyles = {
      // marginBottom: 20
    }

    const inputStyle = {
      // marginTop: 5
    }
    // 'A user with that email/username exists 🫤'

    const showToast = (message: string) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
        autoHide: false,
        visibilityTime: 10000,
        position: 'bottom',
        swipeable: true
      });
    }

    return (
      <SafeAreaView style={[styles.mainContainer, { backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.gray }]}>
        <ScrollView style={styles.container}>
          <View style={styles.headerView}>
            <Text style={[styles.logo, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>LOGO</Text>
          </View>
          {!signupSuccess ? 
            <>
              <View style={styles.subHeaderView}>
              <Text style={[styles.header, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>SIGN UP</Text>
              <Text style={[styles.headerSubText, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>Create your account to get started.</Text>
              </View>
              <View style={styles.formInputs}>
                <FormInputController 
                  control={control as any} 
                  name={'email'} 
                  placeholder={'Enter your email'} 
                  title={'Email'} 
                  errors={errors}
                  inputContainerStyles={inputContainerStyles}
                  inputStyle={inputStyle}
                  />
                <FormInputController 
                  control={control as any} 
                  name={'username'} 
                  placeholder={'Enter your username'} 
                  title={'Username'}
                  errors={errors}
                  inputContainerStyles={inputContainerStyles}
                  inputStyle={inputStyle}
                  />
                <FormInputController 
                  control={control as any} 
                  name={'password'} 
                  placeholder={'Enter your password'} 
                  title={'Password'}
                  errors={errors}
                  inputContainerStyles={inputContainerStyles}
                  inputStyle={inputStyle}
                  props={{
                    secureTextEntry: !showPassword
                  }}
                  rightIcon={
                    <Feather
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color={currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}
                      onPress={() => setShowPassword((prev) => !prev)}
                    />
                  }
                  />
                <FormInputController 
                  control={control as any} 
                  name={'confirmPassword'} 
                  placeholder={'Confirm your password'} 
                  title={'Confirm Password'}
                  errors={errors}
                  inputStyle={inputStyle}
                  props={{
                    secureTextEntry: !showConfirmPassword
                  }}
                  rightIcon={
                    <Feather
                      name={showConfirmPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color={currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}
                      onPress={() => setShowConfirmPassword((prev) => !prev)}
                    />
                  }
                  />
              </View>
              <CustomButton 
                title={isLoading ? "Signing up..." : "Sign Up"}
                handlePress={handleSubmit(submit)}
                textStyles={dynamicTextStyles}
                containerStyles={dynamicContainerStyles}
                isLoading={isLoading}
                />
              <View style={styles.additionalLinks}>
                <Text style={[styles.additionalText, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>
                  Already have an account?{" "}
                </Text>
                <Link href="/signin" style={[styles.signInLink, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>
                  Sign In
                </Link>
              </View>
            </> :
            <>
              <View style={styles.successContainer}>
                <View style={styles.signupSuccessHeader}>
                <Text style={styles.signupSuccessHeaderText}>Thank you for Signing up!</Text>
                </View>
                
                <View style={styles.successMiddle}>
                  <Image source={images.signupSuccess4x} style={styles.successIcon}/>
                  <Text style={styles.mailText}>You've got mail!</Text>
                </View>
                  
                <View>
                  <Text style={styles.checkEmail}>Check your email for a verification link to verify your account before signing in.</Text>
                </View>
                
              </View>
              <CustomButton title="Go to Sign In"
                handlePress={() => router.push('/signin')}
                textStyles={dynamicTextStyles}
                containerStyles={dynamicContainerStyles}/>
            </>
          }
          
        </ScrollView>
      </SafeAreaView>
    )
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
    container: {
      padding: 20,
      flex: 1,
    },
    body: {
        // color: 'white'
    },
    link: {
      marginTop: 15,
      paddingVertical: 15,
    },
    headerView: {
      alignItems: 'center'
    },
    logo: {
      fontFamily: 'ChangaOne',
      fontSize: 30,
      marginTop: 10,
    },
    subHeaderView: {
      alignItems: 'flex-start',
      marginTop: 20
    },
    header: {
      fontFamily: 'ChangaOne',
      fontSize: 30,
    },
    headerSubText: {
      fontFamily: 'MontserratMedium',
      marginTop: 10,
    },
    formInputs: {
      marginTop: 20
    },
    additionalLinks: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop:20
    },
    additionalText: {
      fontFamily: 'MontserratMedium',
    },
    signInLink: {
      fontFamily: 'MontserratBold',
      color: ColorsRevised.black
    },
    signupSuccessHeader: {
      flex: 1,
      paddingTop: 40
    },
    signupSuccessHeaderText: {
      fontFamily: 'MontserratBold',
      color: '#393E46',
      fontSize: 18
    },
    successIcon: {
      width: 150,
      height: 150,
    },
    mailText: {
      fontFamily: 'MontserratSemiBold',
      color: '#393E46',
      fontSize: 17,
      marginTop: 20
    },
    successContainer: {
      alignItems: 'center',
      minHeight: 400,
      marginBottom: 20
    },
    checkEmail: {
      fontFamily: 'MontserratMedium',
      color: '#393E46',
      fontSize: 16,
      textAlign: 'center'
    },
    successMiddle: {
      alignItems: 'center',
      flex: 1
    }
  });
  