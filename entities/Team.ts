export interface Team {
  _id: string;
  owner_id: string;
  name: string;
  teamUsername: string;
  domain: string;
  subdomain: string;
  subdomainTopics: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  teamColor?: string;
}

export interface TeamsResponse {
  message: string;
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
  data: Team[];
}

export interface RecommendationsResponse {
  data: Team[];
} 