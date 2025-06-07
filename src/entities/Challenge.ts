export interface Challenge {
  _id: string;
  owner_id: string;
  team_id: string;
  comments: any[];
  valid: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  challenge_name: string;
  difficulty: number;
  due_date: string;
  description: string;
}

export interface ChallengesResponse {
  message: string;
  data: Challenge[];
} 