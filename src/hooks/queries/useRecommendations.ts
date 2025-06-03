import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiResponse, teamService, RecommendationsResponse } from "../../services/api";

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