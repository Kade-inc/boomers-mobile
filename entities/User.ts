export default interface User {
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmpassword?: string;
  isVerified?: boolean;
  username?: string;
  accountId?: string;
  bio?: string;
  createdAt?: string;
  firstName?: string;
  gender?: string;
  interests?: Interest | null;
  lastName?: string;
  profile_picture?: string | null;
  profile?: UserProfile;
  updatedAt?: string;
  user_id?: string;
  _v?: string;
  _id?: string;
  job?: string;
  location?: string;
}

interface Interest {
  domain: string[];
  subdomain: string[];
  domainTopics: DomainTopic[];
}


export interface UserProfile {
    successful: boolean;
    profile_picture: string | null;
    firstName: string | null;
    lastName: string | null;
    _id?: string;
    username?: string;
    profile: {
      id: string;
      userId: string;
      email: string;
      phoneNumber: number | null;
      firstName: string | null;
      lastName: string | null;
      bio: string | null;
      interests: Interest;
      username: string;
      gender: string | null;
      profilePicture: string | null;
      city: string | null;
      country: string | null;
      latitude: number | null;
      longitude: number | null;
      locationGeo?: {
        type: "Point";
        coordinates: [number, number]; // [longitude, latitude]
      };
      createdAt: string;
      updatedAt: string;
    };
  }
  interface Interest {
    domain: string[];
    subdomain: string[];
    subdomainTopics: string[];
  }
  

interface DomainTopic {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  