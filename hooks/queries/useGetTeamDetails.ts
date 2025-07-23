import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { teamService } from "../../services/api";
import { ApiResponse } from "@/entities/ApiResponse";
import { TeamsResponse } from "@/entities/Team";
import TeamDetails from "@/entities/TeamDetails";

const useGetTeamDetails = (
  teamId: string
): UseQueryResult<ApiResponse<TeamDetails>, Error> => {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      const response = await teamService.getTeamDetails(teamId);
      return response;
    },
  });
};

export default useGetTeamDetails;
