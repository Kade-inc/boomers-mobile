import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator,Platform, Linking, Alert } from 'react-native'
import React, { useState } from 'react'
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
import { useUpdateUserProfile, useUploadProfilePicture, useDeleteProfilePicture } from '@/src/hooks/queries/useUpdateUserProfile'
import Toast from "react-native-toast-message";
import { UserProfile } from '@/entities/User'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Country, City} from 'country-state-city';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from '@expo/vector-icons/build/FontAwesome'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';

function BottomSheet({ isOpen, toggleSheet, duration = 400, children }: { isOpen:any, toggleSheet: () => void, duration?: number, children: any }) {
  const { currentTheme } = useContext(ThemeContext);
  const height = useSharedValue(0);
  const progress = useDerivedValue(() =>
    withTiming(isOpen.value ? 0 : 1, { duration })
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * 2 * height.value }],
  }));

  const backgroundColorSheetStyle = {
    backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark : ColorsRevised.white,
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    zIndex: isOpen.value
      ? 1
      : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  return (
    <>
      <Animated.View style={[sheetStyles.backdrop, backdropStyle]}>
        <TouchableOpacity style={styles.flex} onPress={toggleSheet} />
      </Animated.View>
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[sheetStyles.sheet, sheetStyle, backgroundColorSheetStyle]}>
        {children}
      </Animated.View>
    </>
  );
}

const sheetStyles = StyleSheet.create({
  sheet: {
    paddingTop: 30,
    paddingRight: 20,
    paddingLeft: 20,
    height: 230,
    width: '95%',
    position: 'absolute',
    bottom: 30,
    marginHorizontal: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 2,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});


const EditProfileScreen = () => {
    const { currentTheme } = useContext(ThemeContext);
    const router = useRouter();
    const { user, setUser } = useAuth();
    const [selectedCountry, setSelectedCountry] = useState<string>(
        user?.country || "",
      );
      const [selectedCity, setSelectedCity] = useState<string>(user?.city || "");
    const updateUserProfile = useUpdateUserProfile(user?.user_id || '');
    const uploadProfilePicture = useUploadProfilePicture(user?.user_id || '');
    const deleteProfilePicture = useDeleteProfilePicture(user?.user_id || '');
    const isOpen = useSharedValue(false);

    const toggleSheet = () => {
      isOpen.value = !isOpen.value;
    };

    const {
        control,
        handleSubmit,
        setValue,
        formState: {
          errors
        }
      } = useForm({
        resolver: yupResolver(editProfileFormSchema),
        defaultValues: {
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          job: user?.job || '',
          city: selectedCity,
          country: selectedCountry,
          bio: user?.bio || '',
          email: user?.email || '',
          username: user?.username || ''
        }
      })


      const inputContainerStyles = {
        marginBottom: 20,
      }

      const inputStyle = {
        // marginTop: 10,
      }

       // Get all countries
  const countries = Country.getAllCountries();

  // Get cities for selected country
  const cities = selectedCountry
    ? City.getCitiesOfCountry(
        countries.find((c) => c.name === selectedCountry)?.isoCode || "",
      ) || []
    : [];

    const handleCountryChange = (countryName: string) => {
        setValue('country', countryName);
        setSelectedCountry(countryName);
        setSelectedCity(""); // Reset city when country changes
        setValue('city', ''); // Reset city form value
    };
    
    const handleCityChange = (cityName: string) => {
        setValue('city', cityName);
        setSelectedCity(cityName);
    };

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

      const [image, setImage] = useState<string | null>(null)
      const [status, requestPermission] = ImagePicker.useCameraPermissions()

      const pickImage = async () => {
        try {
          // check for the permission
    
          if (Platform.OS !== 'web') {
            // const {statline} = await ImagePicker.requestCameraPermissionsAsync()
            if (status?.status !== 'granted') {
    
              const permissionResponse = await requestPermission();
              if (permissionResponse.status !== 'granted') {
                Alert.alert("Permission not granted",
                   "You need to grant photo library permission to select an image from the library",
                  [
                    {
                      text: "Cancel"
                    },
                    {
                    text: 'Open Settings',
                    onPress: () => {
                      Platform.OS === 'ios' ? 
                      Linking.openURL('app-settings:') :
                       Linking.openSettings();
                    }
                  }])
                  return
              }
            }
          }
              // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'images',
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
          base64: true,
        });
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
          // Automatically upload the selected image

          await handleUpdateProfilePicture(result.assets[0].uri);
        }
        } catch(error) {
          Toast.show({
            type: 'error',
            text1: 'Failed to update profile picture',
            text2: `${error}`
          });
        }
    
      };

      const handleUpdateProfilePicture = async (imageUri?: string) => {
        try {
          const uriToUpload = imageUri || image;
          if (!uriToUpload) {
            Toast.show({
              type: 'error',
              text1: 'No image selected',
            });
            return;
          }

          const updatedProfile = await uploadProfilePicture.mutateAsync(uriToUpload);
          
          // Update the local user state with the new profile data
          setUser(updatedProfile);
          await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
          
          Toast.show({
            type: 'success',
            text1: 'Profile picture updated successfully!',
          });
          
          // Close the bottom sheet
          toggleSheet();
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Failed to update profile picture',
            text2: `${error}`
          });
        }
      }

      const handleDeleteProfilePicture = async () => {
        try {
          await deleteProfilePicture.mutateAsync();
          
          // Update the local user state by removing the profile picture
          if (user) {
            const updatedUser = { ...user, profile_picture: null } as UserProfile;
            setUser(updatedUser);
            await AsyncStorage.setItem('userProfile', JSON.stringify(updatedUser));
          }
          
          Toast.show({
            type: 'success',
            text1: 'Profile picture deleted successfully!',
          });
          toggleSheet();
        } catch (error) { 
          Toast.show({
            type: 'error',
            text1: 'Failed to delete profile picture',
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
        <ScrollView showsVerticalScrollIndicator={false}>
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
              <TouchableOpacity onPress={toggleSheet}>
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
              </TouchableOpacity>
            </View>
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
              disabled={true}
            />
             <FormInputController 
              control={control as any} 
              name={'username'} 
              placeholder={'Enter your username'} 
              title={'Username'} 
              errors={errors}
              inputContainerStyles={inputContainerStyles}
              inputStyle={inputStyle}
              disabled={true}
            />
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
              name={'bio'} 
              placeholder={'Enter your bio'} 
              title={'Bio'} 
              errors={errors}
              inputContainerStyles={inputContainerStyles}
              inputStyle={inputStyle}
            />
            <View style={{marginBottom: 20}}>
            <Text style={[styles.title, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>Country</Text>
<SelectDropdown
        data={countries.map((country) => country.name)}
        defaultValue={user?.country || ''}
        onSelect={(selectedItem, index) => {
          handleCountryChange(selectedItem);
        }}
        renderButton={(selectedItem, isOpen) => {
          return (
            <View style={[styles.dropdownButtonStyle, {
                backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.white,
                borderColor: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}]}>
              <Text style={[styles.dropdownButtonTxtStyle, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}]}>
                {selectedItem || 'Select your country'}
              </Text>
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && {backgroundColor: '#D2D9DF'}),
              }}>
              <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
            </View>
          );
        }}
        dropdownStyle={styles.dropdownMenuStyle}
        search
        searchInputStyle={styles.dropdownSearchInputStyle}
        searchInputTxtColor={'#151E26'}
        searchPlaceHolder={'Search here'}
        searchPlaceHolderColor={'#72808D'}
        renderSearchInputLeftIcon={() => {
          return <FontAwesome name={'search'} color={'#72808D'} size={18} />;
        }}
      />
      </View>

<View>
<Text style={[styles.title, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>City</Text>
{selectedCountry && (
    <SelectDropdown
        key={selectedCountry}
        data={cities.map((city) => city.name)}
        defaultValue={selectedCity}
        onSelect={(selectedItem, index) => {
            handleCityChange(selectedItem);
        }}
        renderButton={(selectedItem, isOpen) => {
            return (
                <View style={[styles.dropdownButtonStyle, {
                    backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark: ColorsRevised.white,
                    borderColor: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}]}>
                    <Text style={[styles.dropdownButtonTxtStyle, {color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}]}>
                        {selectedItem || 'Select your city'}
                    </Text>
                </View>
            );
        }}
        renderItem={(item, index, isSelected) => {
            return (
                <View
                    style={{
                        ...styles.dropdownItemStyle,
                        ...(isSelected && {backgroundColor: '#D2D9DF'}),
                    }}>
                    <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                </View>
            );
        }}
        dropdownStyle={styles.dropdownMenuStyle}
        search
        searchInputStyle={styles.dropdownSearchInputStyle}
        searchInputTxtColor={'#151E26'}
        searchPlaceHolder={'Search here'}
        searchPlaceHolderColor={'#72808D'}
        renderSearchInputLeftIcon={() => {
            return <FontAwesome name={'search'} color={'#72808D'} size={18} />;
        }}
    />
)}
</View>
          </View>
        </ScrollView>
        {(updateUserProfile.isPending || uploadProfilePicture.isPending || deleteProfilePicture.isPending) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator
              size="large"
              color={ColorsRevised.white}
            />
          </View>
        )}
              <BottomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
                <TouchableOpacity onPress={toggleSheet} style={{position: 'absolute', top: 10, right: 20}}>  
                {icon.xCircle({color: '#EB4335', size: 24})}
                </TouchableOpacity>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 20, width: '100%'}}>
                <View style={styles.headerImage}>
                {user?.profile_picture ? 
                  <Image source={{uri: user.profile_picture}} style={{width: 50, height: 50, borderRadius: 50}} /> : 
                  icon.user({color: currentTheme === 'dark' ? ColorsRevised.black: ColorsRevised.darkgray, size: 60})
                }
              </View>
                </View>
        <View style={{flexDirection: 'column', gap: 16}}>
          <TouchableOpacity onPress={pickImage} disabled={uploadProfilePicture.isPending || deleteProfilePicture.isPending}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          {icon.photoLibrary({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray, size: 26})}
            <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray, fontFamily: 'MontserratMedium', fontSize: 13}}>
              {uploadProfilePicture.isPending ? 'Uploading...' : 'Choose from library'}
            </Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity disabled={uploadProfilePicture.isPending || deleteProfilePicture.isPending}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
          {icon.camera({color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray, size: 24})}
            <Text style={{color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.darkgray, fontFamily: 'MontserratMedium', fontSize: 13}}>Take Photo</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteProfilePicture} disabled={uploadProfilePicture.isPending || deleteProfilePicture.isPending}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 4}}>
          {icon.delete({color: '#EB4335', size: 24})}
            <Text style={{color: '#EB4335', fontFamily: 'MontserratMedium', fontSize: 13}}>
              {deleteProfilePicture.isPending ? 'Deleting...' : 'Delete'}
            </Text>
          </View>
          </TouchableOpacity>
        </View>
        
      </BottomSheet>
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
  dropdownButtonStyle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
    justifyContent: 'center',
  },
  dropdownButtonTxtStyle: {
    fontSize: 14,
    fontFamily: 'MontserratMedium',
  },
  dropdownItemStyle: {
    padding: 10,
        color: 'black'
  },
  dropdownItemTxtStyle: {
    fontSize: 16,
        color: 'black'
  },
  dropdownMenuStyle: {
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRadius: 5,
        color: 'black'
  },
  dropdownSearchInputStyle: {
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRadius: 5,
        color: 'black'
  },
   title: {
        fontFamily: 'MontserratSemiBold',
        fontSize: 16,
        marginBottom: 10,
    },
    flex: {
      flex: 1,
    },
    buttonContainer: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-around',
    },
    bottomSheetButton: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingBottom: 2,
    },
    bottomSheetButtonText: {
      fontWeight: 600,
      textDecorationLine: 'underline',
    },
});