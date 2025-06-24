import { useMutation } from '@tanstack/react-query';
import { userService } from '../../services/api';
import { UserProfile } from '@/entities/User';

export const useUpdateUserProfile = (userId: string) => {
  return useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await userService.updateUserProfile(userId, data);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Update failed');
      }
      return response.data;
    }
  });
};

export const useUploadProfilePicture = (userId: string) => {
  return useMutation({
    mutationFn: async (imageUri: string) => {
      const response = await userService.uploadProfilePicture(userId, imageUri);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Upload failed');
      }
      return response.data;
    }
  });
};

export const useDeleteProfilePicture = (userId: string) => {
  return useMutation({
    mutationFn: async () => {
      const response = await userService.deleteProfilePicture(userId);
      if (!response.success) {
        throw new Error(response.error || 'Delete failed');
      }
      return response.data;
    }
  });
};