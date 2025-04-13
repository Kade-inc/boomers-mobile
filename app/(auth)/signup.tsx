import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useForm, Controller} from "react-hook-form"
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from '@/components/CustomButton';
import FormInputController from "@/components/controllers/FormInputController";
import { yupResolver } from '@hookform/resolvers/yup'
import { signUpFormSchema } from "@/constants/schemas/authSchemas";
import { Link } from "expo-router";

export default function SignupScreen() {
    const {
      control,
      handleSubmit,
      formState: {
        errors
      }
    } = useForm({
      resolver: yupResolver(signUpFormSchema)
    })

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
            <FormInputController 
              control={control} 
              name={'email'} 
              placeholder={'Enter your email'} 
              title={'Email'} 
              errors={errors}
              />
            <FormInputController 
              control={control} 
              name={'username'} 
              placeholder={'Enter your username'} 
              title={'Username'}
              errors={errors}
              />
            <FormInputController 
              control={control} 
              name={'password'} 
              placeholder={'Enter a password'} 
              title={'Password'}
              props={{
                secureTextEntry: true
              }}
              errors={errors}
              />
            <FormInputController 
              control={control} 
              name={'confirmPassword'} 
              placeholder={'Confirm your password'} 
              title={'Confirm Password'}
              props={{
                secureTextEntry: true
              }}
              errors={errors}
              />
          </View>
          <CustomButton title="Sign Up"
            handlePress={handleSubmit(submit)}
            textStyles={dynamicTextStyles}
            containerStyles={dynamicContainerStyles}/>
           <View style={styles.additionalLinks}>
            <Text style={styles.additionalText}>
              Already Have an account?{" "}
            </Text>
            <Link href="/signin" style={styles.signInLink}>
              Sign In
            </Link>
          </View>
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
    additionalLinks: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop:20
    },
    additionalText: {
      fontFamily: 'MontserratMedium',
       color: '#393E46'
    },
    signInLink: {
      fontFamily: 'MontserratBold',
       color: '#393E46'
    }
  });
  