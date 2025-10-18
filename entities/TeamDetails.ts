export default interface TeamDetails {
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
  members: Member[];
}

interface Interest {
  domain: string[];
  subdomain: string[];
  domainTopics: DomainTopic[];
}

interface DomainTopic {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Member {
  _id: string;
  username: string;
  email: string;
  profile: string;
  firstName?: string;
  lastName?: string;
  profile_picture: string | null;
  interests: Interest;
}
