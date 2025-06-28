import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { teamService } from "../../services/api";
import { ApiResponse } from "@/src/entities/ApiResponse";
import { TeamsResponse } from "@/src/entities/Team";

const useGetAllTeams = (page: number, limit: number): UseQueryResult<ApiResponse<TeamsResponse>, Error> => {
    return useQuery({
        queryKey: ['teams'],
        queryFn: async () => {
            const response = await teamService.getAllTeams(page, limit);
            return response;
        },
    });
};

export default useGetAllTeams;