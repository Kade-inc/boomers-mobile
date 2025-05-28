import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface VerificationCodeInputProps {
    control: Control<FieldValues>;
    name: string;
    errors?: any;
    title: string;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({ control, name, errors, title }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const colorScheme = useColorScheme();

    const handleChange = (text: string, index: number, onChange: (value: string) => void) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);
        
        // Join the array and update the form value
        const fullCode = newCode.join('');
        onChange(fullCode);

        // Move to next input if current input is filled
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // Move to previous input on backspace if current input is empty
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>{title}</Text> */}
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <View style={styles.inputContainer}>
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => { inputRefs.current[index] = ref }}
                                style={[
                                    styles.input,
                                    {
                                        color: Colors[colorScheme ?? 'light'].text,
                                        borderColor: Colors[colorScheme ?? 'light'].text
                                    }
                                ]}
                                maxLength={1}
                                keyboardType="numeric"
                                value={code[index]}
                                onChangeText={(text) => handleChange(text, index, onChange)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                            />
                        ))}
                    </View>
                )}
            />
            {errors && errors[name] && (
                <Text style={styles.errorText}>{String(errors[name]?.message)}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    title: {
        fontFamily: 'MontserratMedium',
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    input: {
        width: 45,
        height: 45,
        borderWidth: 1,
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'MontserratRegular',
    },
    errorText: {
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

export default VerificationCodeInput; 