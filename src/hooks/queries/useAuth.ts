import { useMutation, useQuery } from '@tanstack/react-query';
import { authService, RegisterRequest, LoginRequest, RegisterResponse } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
  const login = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await authService.login(credentials);
      if (!response.success) {
        throw new Error(response.error || 'Login failed');
      }
      return response.data;
    },
  });

  const register = useMutation({
    mutationFn: async (credentials: RegisterRequest) => {
      console.log('Register mutation called with:', credentials);
      const response = await authService.register(credentials);
      console.log('Register mutation response:', response);
      
      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }
      
      // Store the verification code if needed
      if (response.data?.verificationCode) {
        await AsyncStorage.setItem('verificationCode', response.data.verificationCode);
      }
      
      return response.data;
    },
  });

  return {
    login,
    register,
  };
} 