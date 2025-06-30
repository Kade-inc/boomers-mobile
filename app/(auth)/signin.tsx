import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useForm } from "react-hook-form"
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from '@/components/ui/CustomButton';
import FormInputController from "@/components/controllers/FormInputController";
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, router } from "expo-router";
import { useContext } from "react";
import Toast from "react-native-toast-message";
import { loginFormSchema } from "@/constants/schemas/loginSchemas";
import { useAuth as useAuthMutations } from "@/hooks/queries/useAuth";
import { useAuth as useAuthContext } from "@/context/AuthContext";
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeContext } from "@/context/ThemeContext";
import { ColorsRevised } from "@/constants/ColorsRevised";

interface LoginFormData {
  username: string;
  password: string;
}

export default function SigninScreen() {
    const colorScheme = useColorScheme();
    const {
        control,
        handleSubmit,
        formState: {
          errors
        }
      } = useForm<LoginFormData>({
        resolver: yupResolver(loginFormSchema)
      })
  
      const { login } = useAuthMutations();
      const { checkAuth } = useAuthContext();
  
      const submit = async (data: LoginFormData) => {
        try {
          await login.mutateAsync({
            accountId: data.username,
            password: data.password
          });

          await checkAuth(); // This will now fetch the user profile
          router.replace('/(tabs)');
        } catch (error) {
          showToast(error instanceof Error ? error.message : 'Login failed');
        }
      };
  
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
          text1: 'Login Failed',
          text2: message === 'Error: Invalid email/phone or password' ? 'Invalid credentials 😬' : message,
          autoHide: true,
          visibilityTime: 5000,
          position: 'bottom',
          swipeable: true
        });
      }

      const inputContainerStyles = {
        // marginBottom: 20,
      }

      const inputStyle = {
        // marginTop: 10
      }

      const { currentTheme } = useContext(ThemeContext);  

    return (
         <SafeAreaView style={[styles.mainContainer, { backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.gray }]}>
        <ScrollView style={styles.container}>
          <View style={styles.headerView}>
            <Text style={[styles.logo, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>LOGO</Text>
          </View>
              <View style={styles.subHeaderView}>
              <Text style={[styles.header, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>SIGN IN</Text>
              <Text style={[styles.headerSubText, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>Enter your credentials to sign in.</Text>
              </View>
              <View style={styles.formInputs}>
                <FormInputController 
                  control={control as any} 
                  name={'username'} 
                  placeholder={'Enter your email or username'} 
                  title={'Email/Username'} 
                  errors={errors}
                  inputContainerStyles={inputContainerStyles}
                  inputStyle={inputStyle}
                  />
                <FormInputController 
                  control={control as any} 
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
              <CustomButton 
                title={login.isPending ? "Signing In..." : "Sign In"}
                handlePress={handleSubmit(submit)}
                textStyles={dynamicTextStyles}
                containerStyles={dynamicContainerStyles}
                isLoading={login.isPending}
                />
              <View style={styles.additionalLinks}>
                <Text style={[styles.additionalText, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>
                    Don't have an account?{" "}
                </Text>
                <Link href="/signup" style={[styles.signInLink, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>
                  Sign Up
                </Link>
              </View>
              <View style={styles.additionalLinks}>
                <Link href="/forgotPassword" style={[styles.signInLink, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>
                  <Text style={[styles.forgotPassword, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>
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
      forgotPassword: {
        fontFamily: 'MontserratSemiBold',
      },
      signInLink: {
        fontFamily: 'MontserratBold',
      },
      signupSuccessHeader: {
        flex: 1,
        paddingTop: 40
      },
      signupSuccessHeaderText: {
        fontFamily: 'MontserratBold',
        fontSize: 18
      },
      successIcon: {
        width: 150,
        height: 150,
      },
      mailText: {
        fontFamily: 'MontserratSemiBold',
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
        fontSize: 16,
        textAlign: 'center'
      },
      successMiddle: {
        alignItems: 'center',
        flex: 1
      }
    });
    