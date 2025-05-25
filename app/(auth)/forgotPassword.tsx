import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useForm} from "react-hook-form"
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from '@/components/CustomButton';
import FormInputController from "@/components/controllers/FormInputController";
import { yupResolver } from '@hookform/resolvers/yup'
import { Link } from "expo-router";
import { useState } from "react";
import { images } from "@/constants";
import Toast from "react-native-toast-message";
import { forgotPasswordFormSchema } from "@/constants/schemas/forgotPasswordSchema";
import { useAuth } from "@/src/hooks/queries/useAuth";
import { useRouter } from "expo-router";
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function ForgotPasswordScreen() {
    const { forgotPassword } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();

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
        try {
          const response = await forgotPassword.mutateAsync({
            email: data.email,
            source: 'mobile'
          });

          if (response.message) {
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
        }
      };
  
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

    return (
        <SafeAreaView style={[styles.mainContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <ScrollView style={styles.container}>
                <View style={styles.headerView}>
                    <Text style={[styles.logo, { color: Colors[colorScheme ?? 'light'].text }]}>LOGO</Text>
                </View>
                <View style={styles.subHeaderView}>
                    <Text style={[styles.header, { color: Colors[colorScheme ?? 'light'].text }]}>FORGOT PASSWORD</Text>
                    <Text style={[styles.headerSubText, { color: Colors[colorScheme ?? 'light'].text }]}>Enter your email to reset your password.</Text>
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
                    title={forgotPassword.isPending ? "Sending..." : "Send Reset Link"}
                    handlePress={handleSubmit(submit)}
                    textStyles={dynamicTextStyles}
                    containerStyles={dynamicContainerStyles}
                    isLoading={forgotPassword.isPending}
                />
                <View style={styles.additionalLinks}>
                    <Link href="/signin" style={[styles.signInLink, { color: Colors[colorScheme ?? 'light'].text }]}>
                        <Text style={[styles.additionalText, { color: Colors[colorScheme ?? 'light'].text }]}>
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
        marginTop: 20
    },
    additionalText: {
        fontFamily: 'MontserratMedium',
    },
    signInLink: {
        fontFamily: 'MontserratBold',
    }
});
    