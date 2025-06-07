export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profile_picture?: string;
  bio?: string;
  interests?: string[];
  createdAt: string;
  updatedAt: string;
} 