import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { teamService } from "../../services/api";
import { ApiResponse } from "@/src/entities/ApiResponse";
import { TeamsResponse } from "@/src/entities/Team";

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