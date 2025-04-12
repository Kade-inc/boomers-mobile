import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useForm, Controller} from "react-hook-form"
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from '@/components/CustomButton';

export default function SignupScreen() {

    const {
      control,
      handleSubmit,
      formState: {
        errors
      }
    } = useForm()

    const submit = (data) => {
      console.log(data)
    }

    const dynamicTextStyles = {
      fontSize: 16,
      color: '#393E46'
    }

    const dynamicContainerStyles = {
      marginTop: 10
    }
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.headerView}>
            <Text style={styles.logo}>LOGO</Text>
          </View>
          <View style={styles.subHeaderView}>
              <Text style={styles.header}>SIGN UP</Text>
              <Text style={styles.headerSubText}>Create an account to begin your journey.</Text>
          </View>
          <View style={styles.formInputs}>
            <View style={styles.inputSection}>
              <Text style={styles.inputTitle}>Email</Text>
              <Controller 
                name='email'
                control={control} 
                render={({field: {onChange, onBlur, value} }) => (
                    <TextInput 
                    placeholder="Enter your email"
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    autoCapitalize={'none'}
                    />
                )}
                rules={{required: true, pattern: /^\S+@\S+\.\S+$/}}
              />
              {errors.email && <Text style={styles.textError}>Enter a valid email</Text>}
            </View>
            <View style={styles.inputSection}>
            <Text style={styles.inputTitle}>Username</Text>
            <Controller 
              name='username'
              control={control} 
              render={({field: {onChange, onBlur, value} }) => (
                  <TextInput 
                  placeholder="Create a username"
                  style={styles.input}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  autoCapitalize={'none'}
                  />
              )}
              rules={{required: true, minLength: 5}}
            />
            {errors.username && <Text style={styles.textError}>Username is required</Text>}
            </View>
            
          </View>
          <CustomButton title="Sign Up"
            handlePress={handleSubmit(submit)}
            textStyles={dynamicTextStyles}
            containerStyles={dynamicContainerStyles}/>
        </ScrollView>
      </SafeAreaView>
    )
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
    container: {
      padding: 20,
      flex: 1,
    },
    body: {
        // color: 'white'
    },
    link: {
      marginTop: 15,
      paddingVertical: 15,
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
    header: {
      fontFamily: 'ChangaOne',
      fontSize: 30,
      color: '#393E46'
    },
    headerSubText: {
      fontFamily: 'MontserratMedium',
      marginTop: 10,
    },
    formInputs: {
      marginTop: 20
    },
    inputTitle: {
      fontFamily: 'MontserratMedium'
    },
    inputSection: {
      marginBottom: 20
    },
    input: {
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      marginTop: 10,
      borderColor: '#393E46',
      fontFamily: 'MontserratRegular'
    },
    textError: {
      backgroundColor: '#EB4335',
      paddingLeft: 5,
      paddingVertical: 8,
      borderRadius: 3,
      color: 'white',
      fontFamily: 'MontserratMedium',
      fontSize: 12,
      marginTop: 8
    }
  });
  