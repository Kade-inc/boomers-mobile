import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icon } from '@/constants/icon'
import { ColorsRevised } from '@/constants/ColorsRevised'
import { useRouter } from 'expo-router'
import { useContext } from 'react'
import { ThemeContext } from '@/src/context/ThemeContext'
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/src/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import FormInputController from '@/components/controllers/FormInputController';
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { editProfileFormSchema } from '@/constants/schemas/editProfileSchema'
import { useUpdateUserProfile } from '@/src/hooks/queries/useUpdateUserProfile'
import Toast from "react-native-toast-message";
import { UserProfile } from '@/entities/User'
import AsyncStorage from '@react-native-async-storage/async-storage'

const EditProfileScreen = () => {
    const { currentTheme } = useContext(ThemeContext);
    const router = useRouter();
    const { user, setUser } = useAuth();
    const updateUserProfile = useUpdateUserProfile(user?.user_id || '');
    const {
        control,
        handleSubmit,
        formState: {
          errors
        }
      } = useForm({
        resolver: yupResolver(editProfileFormSchema),
        defaultValues: {
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          job: user?.job || '',
          city: user?.city || '',
          country: user?.country || '',
          bio: user?.bio || ''
        }
      })


      const inputContainerStyles = {
        marginBottom: 20,
      }

      const inputStyle = {
        marginTop: 10,
      }

      const submit = async (data: Partial<UserProfile>) => {
        try {
            const updatedProfile = await updateUserProfile.mutateAsync(data);
            // Update the local storage with the new profile data
            setUser(updatedProfile);
            await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
            Toast.show({
                type: 'success',
                text1: 'Profile updated successfully!',
            });
            router.back();
          
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: `Failed to update profile`,
                text2: `${error}`
            });
        }
      }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark : ColorsRevised.white}]}>
        <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            {icon.arrowLeft({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black })}
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>
              Edit Profile
            </Text>
            <TouchableOpacity onPress={handleSubmit(submit)} >
              <Text style={[styles.saveButton, {color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black}]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          <View style={styles.headerContainer}>
            <View>
              <LinearGradient
                colors={['#FBE9D7', '#F6D5F7']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
                style={{ height: 120, paddingHorizontal: 20, paddingVertical: 10}}
              />
            </View>
            <View style={styles.headerImageContainer}>
              <View style={styles.headerImage}>
                {user?.profile_picture ? 
                  <Image source={{uri: user.profile_picture}} style={styles.headerImageUser} /> : 
                  icon.user({color: currentTheme === 'dark' ? ColorsRevised.black: ColorsRevised.darkgray, size: 60})
                }
              </View>
              <View style={styles.headerImageOverlay} />
              <View style={styles.headerImagePlaceholder}>
                {icon.camera({color: ColorsRevised.white, size: 35})}
              </View>
            </View>
          </View>
          <View style={styles.formInputs}>
            <FormInputController 
              control={control as any} 
              name={'firstName'} 
              placeholder={'Enter your first name'} 
              title={'First Name'} 
              errors={errors}
              inputContainerStyles={inputContainerStyles}
              inputStyle={inputStyle}
            />
            <FormInputController 
              control={control as any} 
              name={'lastName'} 
              placeholder={'Enter your last name'} 
              title={'Last Name'} 
              errors={errors}
              inputContainerStyles={inputContainerStyles}
              inputStyle={inputStyle}
            />
            <FormInputController 
              control={control as any} 
              name={'job'} 
              placeholder={'Enter your job'} 
              title={'Job'} 
              errors={errors}
              inputContainerStyles={inputContainerStyles}
              inputStyle={inputStyle}
            />
            <FormInputController 
              control={control as any} 
              name={'city'} 
              placeholder={'Enter your city'} 
              title={'City'} 
              errors={errors}
              inputContainerStyles={inputContainerStyles}
              inputStyle={inputStyle}
            />
            <FormInputController 
              control={control as any} 
              name={'country'} 
              placeholder={'Enter your country'} 
              title={'Country'} 
              errors={errors}
              inputContainerStyles={inputContainerStyles}
              inputStyle={inputStyle}
            /> 
            <FormInputController 
              control={control as any} 
              name={'bio'} 
              placeholder={'Enter your bio'} 
              title={'Bio'} 
              errors={errors}
              inputContainerStyles={inputContainerStyles}
              inputStyle={inputStyle}
            />
          </View>
        </ScrollView>
        {updateUserProfile.isPending && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator
              size="large"
              color={ColorsRevised.white}
            />
          </View>
        )}
    </SafeAreaView>
  )
}

export default EditProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'MontserratSemiBold',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    fontFamily: 'MontserratSemiBold',
    fontSize: 16,
  },
  headerContainer: {
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  headerImage: {
    
  },
  headerImageUser: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  headerImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: 85,
    left: 20,
    width: 70,
    height: 70,
    zIndex: 1,
  },
  headerImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    zIndex: 1,
  },
  headerImagePlaceholder: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  formInputs: {
    marginTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});