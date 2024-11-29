import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  Image,
} from "react-native";
import {
  useForm,
  Controller,
  Control,
  FieldValues,
  FieldErrors,
} from "react-hook-form";
import { FC, useState } from "react";
import { icons } from '@/constants'

interface FormInputControllerProps {
  control: Control<FieldValues>;
  errors?: FieldErrors<FieldValues>;
  name: string;
  placeholder: string;
  props?: TextInputProps;
  title: string;
  isPassword?: boolean
}
const FormInputController: FC<FormInputControllerProps> = ({
  control,
  errors,
  name,
  title,
  placeholder,
  isPassword = false,
  props,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to toggle visibility
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  return (
    <View className="gap-2 mt-4" style={{marginTop: 16}}>
      <Text className="font-msemibold text-secondary text-lg">{title}</Text>
      <View className="border border-secondary w-full h-16 px-4 rounded-lg flex-row items-center" style={{ height: 56, borderColor: '#000000', borderWidth: 1, borderRadius: 5}}>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
            <TextInput
              className="text-secondary font-mregular text-lg"
              style={{ flex: 1 }}
              placeholder={placeholder}
              placeholderTextColor="#7b7b8b"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry={(isPassword && !isPasswordVisible) && (isPassword && !isConfirmPasswordVisible)}
              {...props}
            />
            {title === "Password" && (
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Image source={!isPasswordVisible ?  icons.eye: icons.eyeHide} className="w-4 h-4" resizeMode="contain"/>
              </TouchableOpacity>
          )}
          {title === "Confirm Password" && (
              <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                  <Image source={!isConfirmPasswordVisible ?  icons.eye: icons.eyeHide} className="w-4 h-4" resizeMode="contain"/>
              </TouchableOpacity>
          )}
          </>
          )}
        
        />
      </View>

      {errors && errors[name] && (
        <View className="justify-center rounded" style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 8, backgroundColor: '#C01212' }}>
          <Text
            className="text-white text-md font-mregular"
            style={{ lineHeight: 20, color: '#FFFFFF' }}
          >
            {errors[name]?.message}
          </Text>
        </View>
      )}
    </View>
  );
};

export default FormInputController;
