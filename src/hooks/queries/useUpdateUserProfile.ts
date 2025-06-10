import { useMutation } from "@tanstack/react-query";
import { userService } from "../../services/api";
import { UserProfile } from "@/entities/User";

export const useUpdateUserProfile = (userId: string) => useMutation<UserProfile, Error, Partial<UserProfile>>({
    mutationFn: async (data) => {
        const response = await userService.updateUserProfile(userId, data);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Update failed');
        }
        return response.data;
    }
})