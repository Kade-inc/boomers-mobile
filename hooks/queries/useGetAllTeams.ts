import { useInfiniteQuery } from "@tanstack/react-query";
import { teamService } from "../../services/api";

const useGetAllTeams = (page: number, name: string, domain: string = '', subdomain: string = '', subdomainTopics: string = '') => {
    return useInfiniteQuery({
        queryKey: ['teams', name, domain, subdomain, subdomainTopics],
        queryFn: async ({ pageParam }) => {
            const response = await teamService.getAllTeams(pageParam, name, domain, subdomain, subdomainTopics);
            return response;
        },
        initialPageParam: page,
        getNextPageParam: (lastPage, pages) => pages.length + 1
    });
};

export default useGetAllTeams;