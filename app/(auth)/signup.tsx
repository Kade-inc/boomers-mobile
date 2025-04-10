import { StyleSheet, Text, View } from "react-native";

export default function SignupScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.body}>Signup</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    body: {
        // color: 'white'
    },
    link: {
      marginTop: 15,
      paddingVertical: 15,
    },
  });
  