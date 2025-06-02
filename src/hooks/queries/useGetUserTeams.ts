import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiResponse, teamService, TeamsResponse } from "../../services/api";

const useGetUserTeams = (
    userId: string,
): UseQueryResult<ApiResponse<TeamsResponse>, Error> => {
    return useQuery({
        queryKey: ['user-teams', userId],
        queryFn: async () => {
            console.log('Fetching teams for userId:', userId);
            const response = await teamService.getUserTeams(userId);
            console.log('Teams response:', response);
            return response;
        },
        enabled: !!userId,
    });
};

export default useGetUserTeams;