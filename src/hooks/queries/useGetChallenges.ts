import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { challengeService } from "../../services/api";
import { ApiResponse } from "@/src/entities/ApiResponse";
import { ChallengesResponse } from "@/src/entities/Challenge";

const useGetChallenges = (
    userId: string = "",
    valid: boolean = true,
): UseQueryResult<ApiResponse<ChallengesResponse>, Error> => {
    return useQuery({
        queryKey: ['challenges', userId, valid],
        queryFn: async () => {
            const response = await challengeService.getChallenges(userId, valid);
            return response;
        },
    });
};

export default useGetChallenges;