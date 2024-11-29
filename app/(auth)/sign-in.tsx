import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import FormInputController from "@/components/controllers/FormInputController";
import { yupResolver } from "@hookform/resolvers/yup";
import { formSchema } from "@/constants/schemas/authschemas";

const SignIn = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const submit = (data: any) => {
    console.log("DATA: ", data);
  };
  return (
    <SafeAreaView className="h-full px-4 bg-white">
      <ScrollView>
        <View className="min-h-[85vh]">
          <View className="items-center mb-8 mt-8">
            <Text className="font-cregular text-4xl text-secondary">LOGO</Text>
          </View>
          <View className="gap-2">
            <Text className="font-cregular text-4xl text-secondary">
              SIGN IN
            </Text>
            <Text className="font-msemibold text-lg text-secondary">
              Enter your credentials to sign in.
            </Text>
          </View>
          {/* Each form field is a view */}
          <FormInputController
            control={control}
            name={"email"}
            title={"Email/Username"}
            placeholder={"Email or username"}
            errors={errors}
          />
          <FormInputController
            control={control}
            name={"password"}
            title={"Password"}
            placeholder={"Password"}
            isPassword={true}
            errors={errors}
          />

          <TouchableOpacity
            className="bg-primary rounded font-mregular min-h-[50px] justify-center items-center mt-7"
            activeOpacity={0.7}
            onPress={handleSubmit(submit)}
          >
            <Text className="font-msemibold text-secondary text-lg">
              SIGN IN
            </Text>
          </TouchableOpacity>
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className=" text-secondary font-mregular">
              Don't have an account?
            </Text>
            <Link href="/sign-up" className="font-msemibold text-secondary">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
