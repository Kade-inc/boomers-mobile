import { useMutation } from '@tanstack/react-query';
import {  userService } from '@/services/api';
import { AddPushTokenRequest, AddPushTokenResponse } from '@/entities/Auth';

export default function useAddPushToken() {
  return useMutation<AddPushTokenResponse, Error, string>({
    mutationFn: async (data) => {
        const response = await userService.addPushToken(data);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Push Token Request failed');
        }
        return response.data;
    }
  });
} 