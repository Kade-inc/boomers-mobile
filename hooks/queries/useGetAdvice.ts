import { useQuery } from '@tanstack/react-query';
import { adviceService } from '@/services/api';

export default function useGetAdvice() {
  return useQuery({
    queryKey: ['advice'],
    queryFn: async () => {
      const response = await adviceService.getAdvice();
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    }
  });
} 