import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator,Platform, Linking, Alert, Pressable } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icon } from '@/constants/icon'
import { ColorsRevised } from '@/constants/ColorsRevised'
import { useRouter } from 'expo-router'
import { useContext } from 'react'
import { ThemeContext } from '@/context/ThemeContext'
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import FormInputController from '@/components/controllers/FormInputController';
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { editProfileFormSchema } from '@/constants/schemas/editProfileSchema'
import { useUpdateUserProfile, useUploadProfilePicture, useDeleteProfilePicture } from '@/hooks/queries/useUpdateUserProfile'
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
import {
  CameraMode,
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import CustomButton from '@/components/ui/CustomButton'

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
    backgroundColor: currentTheme === 'dark' ? ColorsRevised.darkgrayBackground : ColorsRevised.white,
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
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const ref = useRef<CameraView>(null);
    const [uri, setUri] = useState<string | null>(null);
    const [mode, setMode] = useState<CameraMode>("picture");
    const [facing, setFacing] = useState<CameraType>("back");
    const [isTakingPicture, setIsTakingPicture] = useState(false);
    const [flash, setFlash] = useState<FlashMode>("off");
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

          if (isTakingPicture) {
            setIsTakingPicture(false);
            setUri(null)
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
          setIsTakingPicture(true);
          setUri(imageUri || null)
        } finally {
          setIsTakingPicture(false);
          setUri(null)
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

      const openCamera = async () => {
        if (!cameraPermission?.granted) {
          const permission = await requestCameraPermission();
          if (!permission.granted) {
            Alert.alert("Permission not granted",
              "You need to grant camera permission to take a photo",
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
             }]);
            return;
          }
        }
        setIsTakingPicture(true);
      }

      const takePicture = async () => {
        // setIsTakingPicture(true);
        const photo = await ref.current?.takePictureAsync();
        setIsTakingPicture(false);
        setUri(photo?.uri || null);
      };

      const toggleFacing = () => {
        setFacing((prev) => (prev === "back" ? "front" : "back"));
      };

      const toggleFlash = () => {
        setFlash((prev) => (prev === "off" ? "on" : "off"));
      };
      const dynamicTextStyles = {
        fontSize: 16,
        color: ColorsRevised.darkgray
    };

    const dynamicContainerStyles = {
        marginTop: 20
    };

    const takeAnotherPictureStyles = {
      marginTop: 20,
      backgroundColor: '#00CEC8'
    }

    const takeAnotherPictureTextStyles = {
      fontSize: 16,
      color: ColorsRevised.white
  };

      const renderPicture = () => {
        return (
          <SafeAreaView style={{flex: 1, backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark : ColorsRevised.white}}>
              {uploadProfilePicture.isPending && (
                <View style={{  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 200,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1000,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
                <ActivityIndicator size="large" color={ColorsRevised.white} />
              </View>
            )}
              <TouchableOpacity style={{position: 'absolute', top: 10, left: 20}} onPress={() => {
              setUri(null);
              setIsTakingPicture(false);
            }}>
            {icon.xCircle({color: '#EB4335', size: 24})}
            </TouchableOpacity>
              <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Image
                  source={{ uri: uri || '' }}
                  style={{ width: 300, aspectRatio: 1, borderRadius: 250, marginBottom: 20, alignSelf: 'center' }}
                />
                  <CustomButton title='Take another picture'
                textStyles={takeAnotherPictureTextStyles}
                containerStyles={[takeAnotherPictureStyles, {width: '80%'}]}
                handlePress={() => {
                  setUri(null);
                  openCamera();
                }} />
                <CustomButton title='Save Picture'
                textStyles={dynamicTextStyles}
                containerStyles={[dynamicContainerStyles, {width: '80%'}]}
                handlePress={() => {
                  uri ? handleUpdateProfilePicture(uri) : Alert.alert('Please take a picture first');
                }} />
              </View>
          </SafeAreaView>
        );
      };

      const renderCamera = () => {
        if (!cameraPermission?.granted) {
          return null;
        }
        
        return (
          <CameraView
            style={styles.camera}
            ref={ref}
            mode={mode}
            facing={facing}
            mute={false}
            flash={flash}
            responsiveOrientationWhenOrientationLocked
          >
            <View style={styles.shutterContainer}>
              <Pressable onPress={toggleFlash} disabled={facing === "front"} style={{opacity: facing === "front" ? 0.5 : 1}}>
                {flash === "off" ? icon.flashOutline({color: ColorsRevised.white, size: 32}) : icon.flashFilled({color: ColorsRevised.white, size: 32})}
              </Pressable>
              <Pressable onPress={takePicture}>
                {({ pressed }) => (
                  <View
                    style={[
                      styles.shutterBtn,
                      {
                        opacity: pressed ? 0.5 : 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.shutterBtnInner,
                        {
                          backgroundColor: mode === "picture" ? "white" : "red",
                        },
                      ]}
                    />
                  </View>
                )}
              </Pressable>
              <Pressable onPress={toggleFacing}>
                {icon.refresh({color: ColorsRevised.white, size: 32})}
              </Pressable>
            </View>
          </CameraView>
        );
      };
    

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: currentTheme === 'dark' ? ColorsRevised.dark : ColorsRevised.white}]}>
        <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
        {!isTakingPicture && !uri && (

      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            {icon.arrowLeft({ color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black })}
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: currentTheme === 'dark' ? ColorsRevised.white : ColorsRevised.black }]}>
              Edit Profile
            </Text>
            <TouchableOpacity onPress={handleSubmit(submit)}>
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
              {user?.profile_picture && <>
              <View style={styles.headerImageOverlay} />
              <View style={styles.headerProfilePlaceholder}>
                {icon.camera({color: ColorsRevised.white, size: 35})}
              </View>
              </>}
              {!user?.profile_picture && <>
              <View style={styles.headerPlaceholderOverlay} />
              <View style={styles.headerImagePlaceholder}>
                {icon.camera({color: ColorsRevised.white, size: 35})}
              </View>
              </>}
             
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
                  icon.userCircle({color: currentTheme === 'dark' ? ColorsRevised.yellow: ColorsRevised.darkgray, size: 60})
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
          <TouchableOpacity disabled={uploadProfilePicture.isPending || deleteProfilePicture.isPending} onPress={async () => {
            if (cameraPermission?.granted) {
              openCamera();
            } else {
              const permission = await requestCameraPermission();
              if (permission.granted) {
                openCamera();
              }
            }
          }}>
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
      </>
        )}
      {isTakingPicture && !uri && renderCamera()}
      {uri && renderPicture()}
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
    paddingLeft: 10,
    paddingRight: 20,
    paddingBottom: 20,
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
  headerProfilePlaceholder: {
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
  headerImagePlaceholder: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -35 }, { translateY: -16 }],
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  headerPlaceholderOverlay: {
    position: 'absolute',
    top: 0,
    left: -15,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 150,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
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
    camera: {
      flex: 1,
      width: "100%",
    },
    shutterContainer: {
      position: "absolute",
      bottom: 44,
      left: 0,
      width: "100%",
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 30,
    },
    shutterBtn: {
      backgroundColor: "transparent",
      borderWidth: 5,
      borderColor: "white",
      width: 85,
      height: 85,
      borderRadius: 45,
      alignItems: "center",
      justifyContent: "center",
    },
    shutterBtnInner: {
      width: 70,
      height: 70,
      borderRadius: 50,
    },
});