import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from '@/components/CustomButton';
import FormInputController from "@/components/controllers/FormInputController";
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { images } from "@/constants";
import Toast from "react-native-toast-message";
import { verifyResetCodeSchema } from "../../constants/schemas/verifyResetCodeSchema";
import { useAuth } from "@/src/hooks/queries/useAuth";

export default function VerifyResetCodeScreen() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const { verifyResetToken, forgotPassword } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleResendCode = async () => {
        try {
            setIsLoading(true);
            const response = await forgotPassword.mutateAsync({
                email,
                source: 'mobile'
            });

            if (response.message) {
                setCountdown(30);
                setCanResend(false);
                showToast('Verification code has been resent', 'success');
            } else {
                showToast('Failed to resend verification code');
            }
        } catch (error) {
            console.error("Resend code error:", error);
            showToast(error instanceof Error ? error.message : 'Failed to resend verification code');
        } finally {
            setIsLoading(false);
        }
    };

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<{ verificationCode: string }>({
        resolver: yupResolver(verifyResetCodeSchema)
    });

    const dynamicTextStyles = {
        fontSize: 16,
        color: '#393E46'
    };

    const dynamicContainerStyles = {
        marginTop: 20
    };

    const showToast = (message: string, type: 'error' | 'success' = 'error') => {
        Toast.show({
            type,
            text1: type === 'error' ? 'Error' : 'Success',
            text2: message,
            autoHide: false,
            visibilityTime: 10000,
            position: 'bottom',
            swipeable: true
        });
    };

    const submit = async (data: { verificationCode: string }) => {
        try {
            setIsLoading(true);
            const response = await verifyResetToken.mutateAsync({
                email,
                verificationCode: data.verificationCode
            });

            // Navigate to reset password screen with the userId and token
            router.push({
                pathname: '/resetPassword',
                params: { userId: response.userId, token: data.verificationCode }
            });
        } catch (error) {
            console.error("Verify code error:", error);
            showToast(error instanceof Error ? error.message : 'Failed to verify code');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        marginTop: 10
      }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.headerView}>
                        <Text style={styles.logo}>LOGO</Text>
                    </View>
                    <View style={styles.subHeaderView}>
                        <Image source={images.forgotPassword} style={styles.successIcon}/>
                        <Text style={styles.headerSubText}>Enter Verification Code</Text>
                        <Text style={styles.subText}>Please enter the code sent to your email</Text>
                    </View>
                    <View style={styles.formInputs}>
                        <FormInputController 
                            control={control as any} 
                            name={'verificationCode'} 
                            placeholder={'Enter verification code'} 
                            title={'Verification Code'}
                            errors={errors}
                            inputStyle={inputStyle}
                            props={{
                                keyboardType: 'numeric',
                                maxLength: 6
                            }}
                        />
                    </View>
                    <CustomButton 
                        title="Verify Code"
                        handlePress={handleSubmit(submit)}
                        textStyles={dynamicTextStyles}
                        containerStyles={dynamicContainerStyles}
                        isLoading={isLoading}
                    />
                    {/* <View style={styles.additionalLinks}>
                        <Text style={styles.additionalText}>
                            Remember Password?{" "}
                        </Text>
                        <Link href="/signin" style={styles.signInLink}>
                            Sign In
                        </Link>
                    </View> */}
                    <View style={styles.additionalLinks}>
                        <Text style={styles.additionalText}>
                            Didn't receive code?{" "}
                            {canResend ? (
                                <Text style={styles.resendLink} onPress={handleResendCode}>
                                    Resend code
                                </Text>
                            ) : (
                                <Text style={styles.countdownText}>
                                    Resend code in {countdown}s
                                </Text>
                            )}
                        </Text>
                    </View>
                </ScrollView>
                <View style={styles.backLinkContainer}>
                    <Link href="/forgotPassword" style={styles.backLink}>
                        Back
                    </Link>
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
        flex: 1,
        padding: 20,
    },
    scrollView: {
        flex: 1,
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
        alignItems: 'center',
        marginTop: 20
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
        color: '#393E46',
    },
    signInLink: {
        fontFamily: 'MontserratBold',
        color: '#393E46'
    },
    resendLink: {
        fontFamily: 'MontserratBold',
        color: '#393E46',
    },
    countdownText: {
        fontFamily: 'MontserratMedium',
        color: 'green'
    },
    successIcon: {
        width: 100,
        height: 100,
    },
    backLinkContainer: {
        paddingVertical: 20,
        alignItems: 'flex-start'
    },
    backLink: {
        fontFamily: 'MontserratSemiBold',
        color: '#F8B500',
        fontSize: 16,
    }
}); 