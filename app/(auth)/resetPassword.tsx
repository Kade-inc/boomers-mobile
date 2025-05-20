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
import { AuthService } from "@/src/services/authService";
import { resetPasswordFormSchema } from "@/constants/schemas/resetPasswordSchema";

export default function ResetPasswordScreen() {

    const {
        control,
        handleSubmit,
        formState: {
          errors
        }
      } = useForm({
        resolver: yupResolver(resetPasswordFormSchema)
      })
  
      const  [signupSuccess, setSignupSuccess] = useState(false)
  
  
      const submit = async (data) => {
        const authService = new AuthService()
  
        const {email, username, password, confirmPassword} = data
  
        const updatedData = {
          accountId: email,
          password
        }
  
        // const response = await authService.register(updatedData)
        setSignupSuccess(true)
        // if (response.success) {
        //    // setSignupSuccess(true)
        //   console.log("SUCCESS")
        // } else {
        //   console.log("RESPONSE: ", response)
        //   console.log("RRS: ", typeof response.error)
        //   showToast(response.error)
        // }
        
        console.log(data)
      }
  
      const dynamicTextStyles = {
        fontSize: 16,
        color: '#393E46'
      }
  
      const dynamicContainerStyles = {
        marginTop: 20
      }

      const inputContainerStyles = {
        // marginBottom: 20
      }

      const inputStyle = {
        // marginBottom: 20
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

    return (
         <SafeAreaView style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.headerView}>
            <Text style={styles.logo}>LOGO</Text>
          </View>
          {!signupSuccess ? 
                <>
                       <View style={styles.subHeaderView}>
                <Text style={styles.headerSubText}>Reset Password</Text>
              </View>
              <View style={styles.formInputs}>
                <FormInputController 
                  control={control} 
                  name={'password'} 
                  placeholder={'Password'} 
                  errors={errors}
                  inputContainerStyles={inputContainerStyles}
                  props={{
                    secureTextEntry: true
                  }}
                  />
                <FormInputController 
                  control={control} 
                  name={'confirmPassword'} 
                  placeholder={'Confirm Password'} 
                  errors={errors}
                  props={{
                    secureTextEntry: true
                  }}
                  />
              </View>
              <CustomButton title="Reset Password"
                handlePress={handleSubmit(submit)}
                textStyles={dynamicTextStyles}
                containerStyles={dynamicContainerStyles}/>
              <View style={styles.additionalLinks}>
                <Link href="/signin" style={styles.signInLink}>
                  Sign In
                </Link>
              </View>
                </>: 

                <View style={styles.successContainer}>
                <View style={styles.successMiddle}>
                  <Image source={images.signupSuccess4x} style={styles.successIcon}/>
                  <Text style={styles.mailText}>You're password was successfully reset.</Text>
                </View>
            
              <CustomButton title="Go to Sign In"
                handlePress={() => router.push('/signin')}
                textStyles={dynamicTextStyles}
                containerStyles={dynamicContainerStyles}/>
             
                </View>}
           
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
        fontFamily: 'MontserratBold',
        marginTop: 10,
        fontSize: 18
      },
      subText: {
        fontFamily: 'MontserratSemiBold',
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center'
      },

    //   formInputs: {
    //     marginTop: 20
    //   },
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
      successContainer: {
        justifyContent: 'center',
        // alignItems: 'center',
        minHeight: 500,
        // marginBottom: 20,
        // backgroundColor: 'red',
        // flex: 1
      },
      checkEmail: {
        fontFamily: 'MontserratMedium',
        color: '#393E46',
        fontSize: 16,
        textAlign: 'center'
      },
      successMiddle: {
        alignItems: 'center',
        // flex: 1
      }
    });
    