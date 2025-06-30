import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { Feather } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { ColorsRevised } from '@/constants/ColorsRevised';

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
    disabled?: boolean;
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
    rightIcon,
    disabled = false
}: FormInputControllerProps<T>) => {
    const { currentTheme } = useContext(ThemeContext);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={[styles.container, inputContainerStyles]}>
            <Text style={[styles.title, { color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black }]}>{title}</Text>
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
                                    color: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black,
                                    backgroundColor: disabled 
                                        ? currentTheme === 'dark' 
                                            ? ColorsRevised.darkgray 
                                            : ColorsRevised.gray
                                        : currentTheme === 'dark' 
                                            ? ColorsRevised.dark 
                                            : ColorsRevised.gray,
                                    borderColor: currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black,
                                    opacity: disabled ? 0.7 : 1
                                }
                            ]}
                            placeholderTextColor={currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            autoCapitalize={'none'}
                            editable={!disabled}
                            {...props}
                            secureTextEntry={props?.secureTextEntry && !showPassword}
                        />
                        {/* To be removed {rightIcon && <View style={styles.iconWrapper}>{rightIcon}</View>} */}
                        {props?.secureTextEntry && !disabled && (
                            <View style={styles.iconWrapper}>
                                <Feather
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={24}
                                    color={currentTheme === 'dark' ? ColorsRevised.white: ColorsRevised.black}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            </View>
                        )}
                    </View>
                )}
            />
            {errors && errors[name] && <Text style={[styles.textError, { color: ColorsRevised.white }]}>{String(errors[name]?.message)}</Text>}
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
        top: 4,
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