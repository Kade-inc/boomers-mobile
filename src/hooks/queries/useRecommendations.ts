import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { teamService } from "../../services/api";
import { ApiResponse } from "../../entities/Auth";
import { RecommendationsResponse } from "../../entities/Team";

const useRecommendations = (): UseQueryResult<ApiResponse<RecommendationsResponse>, Error> => {
    return useQuery({
        queryKey: ['recommendations'],
        queryFn: async () => {
            const response = await teamService.getRecommendations();
            return response;
        },
    });
};

export default useRecommendations;