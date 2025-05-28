import { useMutation } from "@tanstack/react-query";
import { authService, VerifyResetTokenRequest, VerifyResetTokenResponse } from "../../services/api";
import { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse, ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest, ResetPasswordResponse } from "../../services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
    const login = useMutation<AuthResponse, Error, LoginRequest>({
        mutationFn: async (data) => {
            const response = await authService.login(data);
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Login failed');
            }
            return response.data;
        }
    });

    const register = useMutation<RegisterResponse, Error, RegisterRequest>({
        mutationFn: async (data) => {
            const response = await authService.register(data);
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Registration failed');
            }
            return response.data;
        }
    });

    const forgotPassword = useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
        mutationFn: async (data) => {
            const response = await authService.forgotPassword(data);
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to process forgot password request');
            }
            return response.data;
        }
    });

    const resetPassword = useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
        mutationFn: async (data) => {
            const response = await authService.resetPassword(data);
            if (!response.success || !response.data?.message) {
                throw new Error(response.error || 'Failed to process reset password request');
            }
            return response.data;
        }
    });

    const verifyResetToken = useMutation<VerifyResetTokenResponse, Error, VerifyResetTokenRequest>({
      mutationFn: async (data) => {
          const response = await authService.verifyResetToken(data);
          if (!response.success || !response.data) {
              throw new Error(response.error || 'Failed to process verify reset token request');
          }
          return response.data;
      }
  });

    return {
        login,
        register,
        forgotPassword,
        resetPassword,
        verifyResetToken
    };
}; 