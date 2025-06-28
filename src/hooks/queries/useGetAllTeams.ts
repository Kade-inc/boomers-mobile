import { useInfiniteQuery } from "@tanstack/react-query";
import { teamService } from "../../services/api";

const useGetAllTeams = (page: number) => {
    return useInfiniteQuery({
        queryKey: ['teams'],
        queryFn: async ({ pageParam }) => {
            const response = await teamService.getAllTeams(pageParam);
            return response;
        },
        initialPageParam: page,
        getNextPageParam: (lastPage, pages) => pages.length + 1
    });
};

export default useGetAllTeams;