import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from '@/components/ui/CustomButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { router, useLocalSearchParams } from "expo-router";
import { images } from "@/constants";
import Toast from "react-native-toast-message";
import { verifyResetCodeSchema } from "@/constants/schemas/verifyResetCodeSchema";
import { useAuth } from "@/src/hooks/queries/useAuth";
import { Link } from "expo-router";
import VerificationCodeInput from '@/components/VerificationCodeInput';
import { ThemeContext } from '@/src/context/ThemeContext';
import { ColorsRevised } from '@/constants/ColorsRevised';

interface VerifyResetCodeFormData {
    verificationCode: string;
}

export default function VerifyResetCodeScreen() {
    const { currentTheme } = useContext(ThemeContext);
    const { email } = useLocalSearchParams<{ email: string }>();
    const { verifyResetToken, forgotPassword } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [resendTimer]);

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<VerifyResetCodeFormData>({
        resolver: yupResolver(verifyResetCodeSchema)
    });

    const dynamicTextStyles = {
        fontSize: 16,
        color: '#393E46'
    };

    const dynamicContainerStyles = {
        marginTop: 20
    };

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
    };

    const handleNavigation = useCallback((path: '/forgotPassword' | '/resetPassword') => {
        if (isNavigating) return;
        setIsNavigating(true);
        router.push(path);
    }, [isNavigating, router]);

    const submit = async (data: VerifyResetCodeFormData) => {
        if (isNavigating) return;
        try {
            setIsLoading(true);
            const response = await verifyResetToken.mutateAsync({
                email,
                verificationCode: data.verificationCode
            });

            if (response.userId) {
                setVerificationSuccess(true);
                router.push({
                    pathname: '/resetPassword',
                    params: { userId: response.userId, token: data.verificationCode }
                });
            } else {
                showToast('Failed to verify code');
            }
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to verify code');
        } finally {
            setIsLoading(false);
            setIsNavigating(false);
        }
    };

    const handleResendCode = async () => {
        if (isResending || !canResend) return;
        try {
            setIsResending(true);
            const response = await forgotPassword.mutateAsync({
                email,
                source: 'mobile'
            });

            if (response?.message) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Verification code has been resent to your email',
                    position: 'bottom',
                    visibilityTime: 3000
                });
                setResendTimer(30);
                setCanResend(false);
            } else {
                showToast('Failed to resend verification code');
            }
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to resend verification code');
        } finally {
            setIsResending(false);
        }
    };

    const inputContainerStyles = {
        marginBottom: 20
    };

    if (verificationSuccess) {
        return (
            <SafeAreaView style={[styles.mainContainer, { backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.gray }]}>
                <View style={styles.successContainer}>
                    <View style={styles.successMiddle}>
                        <Image source={images.signupSuccess4x} style={styles.successIcon} />
                        <Text style={[styles.mailText, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>
                            Code Verified Successfully!
                        </Text>
                        <Text style={[styles.checkEmail, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>
                            You can now reset your password.
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.mainContainer, { backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.gray }]}>
            <ScrollView style={styles.container}>
                <View style={styles.headerView}>
                    <Text style={[styles.logo, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>LOGO</Text>
                    <Image source={images.forgotPassword} style={styles.forgotPasswordImage} />
                </View>
                <View style={styles.subHeaderView}>
                    <Text style={[styles.mailText2, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>We sent you a code</Text>
                    <Text style={[styles.headerSubText, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>Enter the verification code sent to your email.</Text>
                </View>
                <View style={styles.formInputs}>
                    <VerificationCodeInput
                        control={control as any}
                        name="verificationCode"
                        errors={errors}
                        title="Verification Code"
                    />
                </View>
                <CustomButton 
                    title={isLoading ? "Verifying..." : "Verify Code"}
                    handlePress={handleSubmit(submit)}
                    textStyles={dynamicTextStyles}
                    containerStyles={dynamicContainerStyles}
                    isLoading={isLoading}
                />
                <View style={styles.resendContainer}>
                    <Text style={[styles.resendText, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>
                        Did not receive code?
                    </Text>
                    <TouchableOpacity 
                        onPress={handleResendCode} 
                        disabled={!canResend || isResending}
                    >
                        <Text style={[
                            styles.resendText, 
                            { 
                                color: ColorsRevised.yellow,
                                opacity: canResend ? 1 : 0.5
                            }
                        ]}>
                            {isResending ? 'Resending...' : canResend ? 'Resend code' : `Resend code (${resendTimer}s)`}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={styles.backLinkWrapper}>
                <Link href="/forgotPassword" onPress={() => handleNavigation('/forgotPassword')} style={styles.backLink}>
                    Back
                </Link>
            </View>
        </SafeAreaView>
    );
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
    forgotPasswordImage: {
        width: 120,
        height: 120,
        marginTop: 20,
        resizeMode: 'contain'
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
    successContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },
    successMiddle: {
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
    },
    backLinkWrapper: {
        width: '100%',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    backLink: {
        fontFamily: 'MontserratBold',
        color: '#F8B500',
        fontSize: 16
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        marginTop: 20
    },
    resendText: {
        fontFamily: 'MontserratSemiBold',
        fontSize: 14,
        textAlign: 'center'
    },
    mailText2: {
        fontFamily: 'MontserratBold',
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center'
    },
}); 