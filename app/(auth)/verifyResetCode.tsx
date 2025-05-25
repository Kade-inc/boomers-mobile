import React, { useState, useCallback } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from '@/components/CustomButton';
import FormInputController from "@/components/controllers/FormInputController";
import { yupResolver } from '@hookform/resolvers/yup';
import { router, useLocalSearchParams } from "expo-router";
import { images } from "@/constants";
import Toast from "react-native-toast-message";
import { verifyResetCodeSchema } from "@/constants/schemas/verifyResetCodeSchema";
import { useAuth } from "@/src/hooks/queries/useAuth";
import { Link } from "expo-router";
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface VerifyResetCodeFormData {
    verificationCode: string;
}

export default function VerifyResetCodeScreen() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const { verifyResetToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const colorScheme = useColorScheme();

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

    const inputContainerStyles = {
        marginBottom: 20
    };

    if (verificationSuccess) {
        return (
            <SafeAreaView style={[styles.mainContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
                <View style={styles.successContainer}>
                    <View style={styles.successMiddle}>
                        <Image source={images.signupSuccess4x} style={styles.successIcon} />
                        <Text style={[styles.mailText, { color: Colors[colorScheme ?? 'light'].text }]}>
                            Code Verified Successfully!
                        </Text>
                        <Text style={[styles.checkEmail, { color: Colors[colorScheme ?? 'light'].text }]}>
                            You can now reset your password.
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.mainContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <ScrollView style={styles.container}>
                <View style={styles.headerView}>
                    <Text style={[styles.logo, { color: Colors[colorScheme ?? 'light'].text }]}>LOGO</Text>
                </View>
                <View style={styles.subHeaderView}>
                    <Text style={[styles.header, { color: Colors[colorScheme ?? 'light'].text }]}>VERIFY CODE</Text>
                    <Text style={[styles.headerSubText, { color: Colors[colorScheme ?? 'light'].text }]}>Enter the verification code sent to your email.</Text>
                </View>
                <View style={styles.formInputs}>
                    <FormInputController 
                        control={control as any} 
                        name={'verificationCode'} 
                        placeholder={'Enter verification code'} 
                        title={'Verification Code'} 
                        errors={errors}
                        inputContainerStyles={inputContainerStyles}
                    />
                </View>
                <CustomButton 
                    title={isLoading ? "Verifying..." : "Verify Code"}
                    handlePress={handleSubmit(submit)}
                    textStyles={dynamicTextStyles}
                    containerStyles={dynamicContainerStyles}
                    isLoading={isLoading}
                />
                <View style={styles.backLinkContainer}>
                    <Link href="/forgotPassword" onPress={() => handleNavigation('/forgotPassword')} style={styles.backLink}>
                        Back to Forgot Password
                    </Link>
                </View>
            </ScrollView>
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
    backLinkContainer: {
        marginTop: 20,
        alignItems: 'center'
    },
    backLink: {
        fontFamily: 'MontserratBold',
        color: '#F8B500',
        fontSize: 16
    }
}); 