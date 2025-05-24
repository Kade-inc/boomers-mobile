import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useForm, Control } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from '@/components/CustomButton';
import FormInputController from "@/components/controllers/FormInputController";
import { yupResolver } from '@hookform/resolvers/yup';
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { images } from "@/constants";
import Toast from "react-native-toast-message";
import { resetPasswordFormSchema } from "@/constants/schemas/resetPasswordSchema";
import { useAuth } from "@/src/hooks/queries/useAuth";
import { Link } from "expo-router";
import { Feather } from '@expo/vector-icons';

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
                {!resetSuccess ? (
                    <>
                        <View style={styles.subHeaderView}>
                            <Text style={styles.headerSubText}>Reset Password</Text>
                        </View>
                        <View style={styles.formInputs}>
                            <FormInputController 
                                control={control as unknown as Control<any>} 
                                name={'password'} 
                                placeholder={'Password'} 
                                title={'New Password'}
                                errors={errors}
                                props={{
                                    secureTextEntry: !showPassword
                                }}
                                rightIcon={
                                    <Feather
                                        name={showPassword ? 'eye' : 'eye-off'}
                                        size={20}
                                        color="#393E46"
                                        onPress={() => setShowPassword((prev) => !prev)}
                                    />
                                }
                                inputStyle={inputStyle}
                                inputContainerStyles={inputContainerStyles}
                            />
                            <FormInputController 
                                control={control as unknown as Control<any>} 
                                name={'confirmPassword'} 
                                placeholder={'Confirm Password'} 
                                title={'Confirm Password'}
                                errors={errors}
                                props={{
                                    secureTextEntry: !showConfirmPassword
                                }}
                                rightIcon={
                                    <Feather
                                        name={showConfirmPassword ? 'eye' : 'eye-off'}
                                        size={20}
                                        color="#393E46"
                                        onPress={() => setShowConfirmPassword((prev) => !prev)}
                                    />
                                }
                                inputStyle={inputStyle}
                                inputContainerStyles={inputContainerStyles}
                            />
                        </View>
                        <CustomButton 
                            title="Reset Password"
                            handlePress={handleSubmit(submit)}
                            textStyles={dynamicTextStyles}
                            containerStyles={dynamicContainerStyles}
                            isLoading={isLoading}
                        />
                    </>
                ) : (
                    <View style={styles.successContainer}>
                        <View style={styles.successMiddle}>
                            <Image source={images.signupSuccess4x} style={styles.successIcon}/>
                            <Text style={styles.mailText}>Your password was successfully reset.</Text>
                        </View>
                        <CustomButton 
                            title="Go to Sign In"
                            handlePress={() => router.push('/signin')}
                            textStyles={dynamicTextStyles}
                            containerStyles={dynamicContainerStyles}
                        />
                    </View>
                )}
            </ScrollView>
            {!resetSuccess && (    
                <View style={styles.backLinkContainer}>
                    <Link href="/forgotPassword" style={styles.backLink}>
                        Back
                    </Link>
                </View>
            )}
        </SafeAreaView>
    );
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
    headerSubText: {
        fontFamily: 'MontserratBold',
        marginTop: 10,
        fontSize: 18
    },
    formInputs: {
        marginTop: 20
    },
    successContainer: {
        justifyContent: 'center',
        minHeight: 500,
    },
    successMiddle: {
        alignItems: 'center',
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
    backLinkContainer: {
        paddingVertical: 20,
        alignItems: 'flex-start',
        paddingLeft: 20
    },
    backLink: {
        fontFamily: 'MontserratSemiBold',
        color: '#F8B500',
        fontSize: 16,
    },
});
    