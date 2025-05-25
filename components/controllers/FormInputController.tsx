import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface FormInputControllerProps<T extends FieldValues> {
    control: Control<T>;
    errors?: FieldErrors<T>;
    name: Path<T>;
    placeholder: string;
    props?: TextInputProps;
    title: string;
    inputContainerStyles?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    rightIcon?: React.ReactNode;
}

const FormInputController = <T extends FieldValues>({
    control,
    errors,
    name,
    placeholder,
    title,
    inputContainerStyles,
    inputStyle,
    props,
    rightIcon
}: FormInputControllerProps<T>) => {
    const [showPassword, setShowPassword] = useState(false);
    const colorScheme = useColorScheme();

    return (
        <View style={[styles.container, inputContainerStyles]}>
            <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>{title}</Text>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder={placeholder}
                            style={[
                                styles.input,
                                inputStyle,
                                {
                                    color: Colors[colorScheme ?? 'light'].text,
                                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                                    borderColor: Colors[colorScheme ?? 'light'].text
                                }
                            ]}
                            placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            autoCapitalize={'none'}
                            {...props}
                            secureTextEntry={props?.secureTextEntry && !showPassword}
                        />
                        {rightIcon && <View style={styles.iconWrapper}>{rightIcon}</View>}
                        {props?.secureTextEntry && (
                            <View style={styles.iconWrapper}>
                                <Feather
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={24}
                                    color={Colors[colorScheme ?? 'light'].icon}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            </View>
                        )}
                    </View>
                )}
            />
            {errors && errors[name] && <Text style={[styles.textError]}>{String(errors[name]?.message)}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    title: {
        fontFamily: 'MontserratSemiBold',
        fontSize: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 10,
        fontFamily: 'MontserratMedium',
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
        fontSize: 14,
        marginTop: 5,
    },
});

export default FormInputController;