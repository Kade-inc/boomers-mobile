import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useForm, Controller} from "react-hook-form"
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from '@/components/CustomButton';
import FormInputController from "@/components/controllers/FormInputController";
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, router } from "expo-router";
import { useState } from "react";
import { images } from "@/constants";
import Toast from "react-native-toast-message";
import { loginFormSchema } from "@/constants/schemas/loginSchemas";

export default function SigninScreen() {

    const {
        control,
        handleSubmit,
        formState: {
          errors
        }
      } = useForm({
        resolver: yupResolver(loginFormSchema)
      })
  
      const  [signupSuccess, setSignupSuccess] = useState(false)
  
  
      const dynamicTextStyles = {
        fontSize: 16,
        color: '#393E46'
      }
  
      const dynamicContainerStyles = {
        marginTop: 20
      }
  
      // 'A user with that email/username exists 🫤'
  
      const showToast = (message: string) => {
        Toast.show({
          type: 'error',
          text1: 'User exists',
          text2: message,
          autoHide: false,
          visibilityTime: 10000,
          position: 'bottom',
          swipeable: true
        });
      }

      const inputContainerStyles = {
        marginBottom: 20,
      }

      const inputStyle = {
        marginTop: 10
      }

    return (
         <SafeAreaView style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.headerView}>
            <Text style={styles.logo}>LOGO</Text>
          </View>
              <View style={styles.subHeaderView}>
              <Text style={styles.header}>SIGN IN</Text>
              <Text style={styles.headerSubText}>Enter your credentials to sign in.</Text>
              </View>
              <View style={styles.formInputs}>
                <FormInputController 
                  control={control} 
                  name={'username'} 
                  placeholder={'Enter your email or username'} 
                  title={'Email/Username'} 
                  errors={errors}
                  inputContainerStyles={inputContainerStyles}
                  inputStyle={inputStyle}
                  />
                <FormInputController 
                  control={control} 
                  name={'password'} 
                  placeholder={'Enter password'} 
                  title={'Password'}
                  props={{
                    secureTextEntry: true
                  }}
                  errors={errors}
                  inputStyle={inputStyle}
                  />
              </View>
              <CustomButton title="Sign In"
                handlePress={handleSubmit(submit)}
                textStyles={dynamicTextStyles}
                containerStyles={dynamicContainerStyles}/>
              <View style={styles.additionalLinks}>
                <Text style={styles.additionalText}>
                    Don't have an account?{" "}
                </Text>
                <Link href="/signup" style={styles.signInLink}>
                  Sign Up
                </Link>
              </View>
              <View style={styles.additionalLinks}>
                <Link href="/forgotPassword" style={styles.signInLink}>
                  <Text style={styles.forgotPassword}>
                    Forgot your password?{" "}
                </Text>
                </Link>
              </View>
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
         color: '#393E46',
      },
      forgotPassword: {
        fontFamily: 'MontserratSemiBold',
         color: '#393E46',
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
    