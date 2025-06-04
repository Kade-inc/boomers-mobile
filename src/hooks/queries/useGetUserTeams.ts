import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiResponse, teamService, TeamsResponse } from "../../services/api";

const useGetUserTeams = (
    userId: string,
): UseQueryResult<ApiResponse<TeamsResponse>, Error> => {
    return useQuery({
        queryKey: ['user-teams', userId],
        queryFn: async () => {
            const response = await teamService.getUserTeams(userId);
            return response;
        },
        enabled: !!userId,
    });
};

export default useGetUserTeams;