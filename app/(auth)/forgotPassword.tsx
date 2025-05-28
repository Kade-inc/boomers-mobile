import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useForm} from "react-hook-form"
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from '@/components/CustomButton';
import FormInputController from "@/components/controllers/FormInputController";
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useRouter } from "expo-router";
import { useState, useCallback, useContext } from "react";
import { images } from "@/constants";
import Toast from "react-native-toast-message";
import { forgotPasswordFormSchema } from "@/constants/schemas/forgotPasswordSchema";
import { useAuth } from "@/src/hooks/queries/useAuth";
import { ThemeContext } from "@/src/context/ThemeContext";
import { ColorsRevised } from "@/constants/ColorsRevised";

export default function ForgotPasswordScreen() {
    const { forgotPassword } = useAuth();
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    const {
        control,
        handleSubmit,
        formState: {
          errors
        }
      } = useForm({
        resolver: yupResolver(forgotPasswordFormSchema)
      })
  
      const submit = async (data: { email: string }) => {
        console.log('data', data);
        if (isNavigating) return;
        try {
          setIsNavigating(true);
          const response = await forgotPassword.mutateAsync({
            email: data.email,
            source: 'mobile'
          });

          console.log("RESPONSE: ", response);

          if (response?.message) {
            // Navigate to verification code screen
            router.push({
              pathname: '/verifyResetCode',
              params: { email: data.email }
            });
          } else {
            showToast('Failed to process forgot password request');
          }
        } catch (error) {
          console.error("Forgot password error:", error);
          showToast(error instanceof Error ? error.message : 'Failed to process forgot password request');
        } finally {
          setIsNavigating(false);
        }
      };

      const handleNavigation = useCallback((path: '/signin' | '/verifyResetCode') => {
        if (isNavigating) return;
        setIsNavigating(true);
        router.push(path);
      }, [isNavigating, router]);
  
      const dynamicTextStyles = {
        fontSize: 16,
        color: '#393E46'
      }
  
      const dynamicContainerStyles = {
        marginTop: 20
      }

      const inputStyle = {
        marginTop: 10
      }

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

      const inputContainerStyles = {
        marginBottom: 20,
      }

      const { currentTheme } = useContext(ThemeContext);

      return (
        <SafeAreaView style={[styles.mainContainer, { backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.gray }]}>
            <ScrollView style={styles.container}>
                <View style={styles.headerView}>
                    <Text style={[styles.logo, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>LOGO</Text>
                    <Image source={images.forgotPassword} style={styles.forgotPasswordImage} />
                </View>
                <View style={styles.subHeaderView}>
                    <Text style={[styles.header, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>Forgot Password?</Text>
                    <Text style={[styles.headerSubText, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>Enter your email to reset your password.</Text>
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
                </View>
                <CustomButton 
                    title={forgotPassword.isPending ? "Sending..." : "Reset Password"}
                    handlePress={handleSubmit(submit)}
                    textStyles={dynamicTextStyles}
                    containerStyles={dynamicContainerStyles}
                    isLoading={forgotPassword.isPending}
                />
                <View style={styles.additionalLinks}>
                    <Link href="/signin" onPress={() => handleNavigation('/signin')} style={[styles.signInLink, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>
                        <Text style={[styles.additionalText, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>
                            Back to Sign In
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
        fontFamily: 'MontserratBold',
        fontSize: 20,
    },
    headerSubText: {
        fontFamily: 'MontserratMedium',
        marginTop: 14,
    },
    formInputs: {
        marginTop: 20
    },
    additionalLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    additionalText: {
        fontFamily: 'MontserratMedium',
    },
    signInLink: {
        fontFamily: 'MontserratBold',
    },
    forgotPasswordImage: {
        width: 120,
        height: 120,
        marginTop: 20,
        resizeMode: 'contain'
    },
});
    