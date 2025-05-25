import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useForm, Control } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from '@/components/CustomButton';
import FormInputController from "@/components/controllers/FormInputController";
import { yupResolver } from '@hookform/resolvers/yup';
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useState } from "react";
import { images } from "@/constants";
import Toast from "react-native-toast-message";
import { resetPasswordFormSchema } from "@/constants/schemas/resetPasswordSchema";
import { useAuth } from "@/src/hooks/queries/useAuth";
import { Link } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

export default function ResetPasswordScreen() {
    const { userId, token } = useLocalSearchParams<{ userId: string; token: string }>();
    const { resetPassword } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const colorScheme = useColorScheme();

    useFocusEffect(
        React.useCallback(() => {
            setResetSuccess(false);
        }, [])
    );

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<ResetPasswordFormData>({
        resolver: yupResolver(resetPasswordFormSchema)
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

    const submit = async (data: ResetPasswordFormData) => {
        if (!token) {
            showToast('Reset token is missing. Please try again.');
            return;
        }
        try {
            setIsLoading(true);
            const response = await resetPassword.mutateAsync({
                userId,
                token,
                password: data.password
            });
            if (response.message) {
                setResetSuccess(true);
            } else {
                showToast('Failed to reset password');
            }
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    const inputContainerStyles = {
        marginBottom: 20
    };

    if (resetSuccess) {
        return (
            <SafeAreaView style={[styles.mainContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
                <View style={styles.successContainer}>
                    <View style={styles.successMiddle}>
                        <Image source={images.signupSuccess4x} style={styles.successIcon} />
                        <Text style={[styles.mailText, { color: Colors[colorScheme ?? 'light'].text }]}>
                            Password Reset Successful!
                        </Text>
                        <Text style={[styles.checkEmail, { color: Colors[colorScheme ?? 'light'].text }]}>
                            Your password has been reset successfully. You can now sign in with your new password.
                        </Text>
                    </View>
                    <Link href="/signin" style={styles.homeLink}>
                        <Text style={styles.homeLinkText}>Back to Sign In</Text>
                    </Link>
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
                    <Text style={[styles.header, { color: Colors[colorScheme ?? 'light'].text }]}>RESET PASSWORD</Text>
                    <Text style={[styles.headerSubText, { color: Colors[colorScheme ?? 'light'].text }]}>Enter your new password.</Text>
                </View>
                <View style={styles.formInputs}>
                    <FormInputController 
                        control={control as any} 
                        name={'password'} 
                        placeholder={'Enter new password'} 
                        title={'New Password'} 
                        errors={errors}
                        inputContainerStyles={inputContainerStyles}
                        props={{
                            secureTextEntry: true
                        }}
                    />
                    <FormInputController 
                        control={control as any} 
                        name={'confirmPassword'} 
                        placeholder={'Confirm new password'} 
                        title={'Confirm Password'} 
                        errors={errors}
                        props={{
                            secureTextEntry: true
                        }}
                    />
                </View>
                <CustomButton 
                    title={isLoading ? "Resetting..." : "Reset Password"}
                    handlePress={handleSubmit(submit)}
                    textStyles={dynamicTextStyles}
                    containerStyles={dynamicContainerStyles}
                    isLoading={isLoading}
                />
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
        justifyContent: 'space-between'
    },
    successMiddle: {
        flex: 1,
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
    homeLink: {
        marginTop: 20,
        alignItems: 'center'
    },
    homeLinkText: {
        fontFamily: 'MontserratBold',
        color: '#F8B500',
        fontSize: 16
    }
});
    