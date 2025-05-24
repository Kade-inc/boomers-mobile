import { View, Text, TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native'
import React, { FC } from 'react'
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form'

interface FormInputControllerProps {
    control: Control<FieldValues>;
    errors?: FieldErrors<FieldValues>;
    name: string;
    placeholder: string;
    props?: TextInputProps;
    title: string;
    inputContainerStyles?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    rightIcon?: React.ReactNode;
}
const FormInputController : FC<FormInputControllerProps> = ({control, errors, name, placeholder, title, inputContainerStyles, inputStyle, props, rightIcon}) => {
  return (
    <View style={[styles.inputSection, inputContainerStyles]}>
        <Text style={[styles.inputTitle]}>{title}</Text>
        <Controller
            name={name}
            control={control} 
            render={({field: {onChange, onBlur, value} }) => (
            <View style={styles.inputWrapper}>
                <TextInput 
                    placeholder={placeholder}
                    style={[styles.input, inputStyle]}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    autoCapitalize={'none'}
                    {...props}
                />
                {rightIcon && <View style={styles.iconWrapper}>{rightIcon}</View>}
            </View>
            )}
        />
        {errors && errors[name] && <Text style={styles.textError}>{String(errors[name]?.message)}</Text>}
   </View>
  )
}
const styles = StyleSheet.create({
      inputTitle: {
        fontFamily: 'MontserratMedium'
      },
      inputSection: {
        // marginBottom: 20 ///REPLACE DYNAMICALLY WITH inputContainerStyle
      },
      inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
      },
      input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        // marginTop: 10, ///REPLACE DYNAMICALLY
        borderColor: '#393E46',
        fontFamily: 'MontserratRegular'
      },
      iconWrapper: {
        position: 'absolute',
        right: 10,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
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

export default FormInputController