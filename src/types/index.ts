export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  email?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  title: string;
  bio: string;
  avatarUrl: string;
  location: string;
  status: string;
  themeColor: string;
  socialLinks: SocialLinks;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProjectItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  longDescription?: string | null;
  imageUrl: string;
  demoUrl: string;
  repoUrl: string;
  tags: string[];
  order: number;
  featured: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ExperienceItem {
  id: string;
  userId: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  skillsUsed: string[];
  order: number;
  createdAt: string | Date;
}

export interface SkillItem {
  id: string;
  userId: string;
  name: string;
  category: "Frontend" | "Backend" | "Database" | "DevOps" | "Tools" | "Other";
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  order: number;
}

export interface PublicPortfolioData {
  user: UserProfile;
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  skills: SkillItem[];
}
