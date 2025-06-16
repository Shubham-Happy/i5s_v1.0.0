
import { Profile } from "@/types/database";

export interface Education {
  id: string;
  school: string;
  degree: string;
  logo?: string;
  startYear: string;
  endYear: string;
  description?: string;
  activities?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  logo?: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  achievements?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expires: string | null;
}

export interface ExtendedProfile extends Profile {
  name?: string;
  coverImage?: string;
  headline?: string;
  location?: string;
  website?: string;
  email?: string;
  joined: string;
  followers: number;
  following: number;
  articles: number;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  certifications?: Certification[];
}
