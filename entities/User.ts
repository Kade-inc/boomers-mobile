interface Interest {
  domain: string[];
  subdomain: string[];
  domainTopics: DomainTopic[];
}

export interface UserProfile {
  _id: string;
  user_id: string;
  email: string;
  phoneNumber: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  interests: Interest;
  username: string;
  gender: string | null;
  profile_picture: string | null;
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
  job?: string;
  location?: string;
  __v?: number;
}

interface DomainTopic {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserProfileResponse {
    successful: boolean;
    profile_picture: string | null;
    firstName: string | null;
    lastName: string | null;
    _id?: string;
    username?: string;
    profile: {
      id: string;
      user_id: string;
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
  