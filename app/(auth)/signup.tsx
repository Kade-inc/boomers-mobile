import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useForm, Controller, Control, FieldErrors } from "react-hook-form"
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from '@/components/CustomButton';
import FormInputController from "@/components/controllers/FormInputController";
import { yupResolver } from '@hookform/resolvers/yup'
import { signUpFormSchema } from "@/constants/schemas/authSchemas";
import { Link, router } from "expo-router";
import { useState } from "react";
import { images } from "@/constants";
import Toast from "react-native-toast-message";
import { useAuth } from "@/src/hooks/queries/useAuth";

interface SignUpFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function SignupScreen() {
    const {
      control,
      handleSubmit,
      formState: {
        errors
      }
    } = useForm<SignUpFormData>({
      resolver: yupResolver(signUpFormSchema)
    })

    const [signupSuccess, setSignupSuccess] = useState(false)
    const { register } = useAuth()

    const submit = async (data: SignUpFormData) => {
      try {
        const { email, username, password } = data
        
        await register.mutateAsync({
          email,
          username,
          password
        })
        
        setSignupSuccess(true)
      } catch (error) {
        console.error("Registration error:", error)
        showToast(error instanceof Error ? error.message : 'Registration failed')
      }
    }

    const dynamicTextStyles = {
      fontSize: 16,
      color: '#393E46'
    }

    const dynamicContainerStyles = {
      marginTop: 20
    }

    const inputContainerStyles = {
      marginBottom: 20
    }

    const inputStyle = {
      marginTop: 10
    }
    // 'A user with that email/username exists 🫤'

    const showToast = (message: string) => {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: message,
        autoHide: false,
        visibilityTime: 10000,
        position: 'bottom',
        swipeable: true
      });
    }

    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.headerView}>
            <Text style={styles.logo}>LOGO</Text>
          </View>
          {!signupSuccess ? 
            <>
              <View style={styles.subHeaderView}>
              <Text style={styles.header}>SIGN UP</Text>
              <Text style={styles.headerSubText}>Create an account to begin your journey.</Text>
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
                  placeholder={'Enter a password'} 
                  title={'Password'}
                  props={{
                    secureTextEntry: true
                  }}
                  errors={errors}
                  inputContainerStyles={inputContainerStyles}
                  inputStyle={inputStyle}
                  />
                <FormInputController 
                  control={control as any} 
                  name={'confirmPassword'} 
                  placeholder={'Confirm your password'} 
                  title={'Confirm Password'}
                  props={{
                    secureTextEntry: true
                  }}
                  errors={errors}
                  inputStyle={inputStyle}
                  />
              </View>
              <CustomButton 
                title={register.isPending ? "Signing Up..." : "Sign Up"}
                handlePress={handleSubmit(submit)}
                textStyles={dynamicTextStyles}
                containerStyles={dynamicContainerStyles}
                isLoading={register.isPending}
                />
              <View style={styles.additionalLinks}>
                <Text style={styles.additionalText}>
                  Already Have an account?{" "}
                </Text>
                <Link href="/signin" style={styles.signInLink}>
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
    backgroundColor: 'white'
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
      color: '#393E46',
    },
    subHeaderView: {
      alignItems: 'flex-start',
      marginTop: 20
    },
    header: {
      fontFamily: 'ChangaOne',
      fontSize: 30,
      color: '#393E46'
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
       color: '#393E46'
    },
    signInLink: {
      fontFamily: 'MontserratBold',
       color: '#393E46'
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
  