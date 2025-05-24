
export interface NavItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: 'Art' | 'Model' | 'Script';
  author?: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
}

export interface ForumPost {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  replies: number;
  views: number;
}

// Updated AdminUser to User
export interface User {
  id: string;
  username: string;
  password?: string; // Password stored directly for mock, normally a hash
  roles: Array<'user' | 'admin'>;
  joinDate: string;
  status?: 'Active' | 'Banned'; // Retain status for existing admin panel features
}

export interface RegistrationKey {
  id: string;
  value: string;
  isUsed: boolean;
  usedBy?: string; // userId who used the key
  generatedBy: string; // admin userId who generated it
  createdAt: string;
}

export interface AdminStatsData {
  name: string;
  users: number;
}

// Gemini specific types
export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  retrievedContext?: {
    uri: string;
    title: string;
  };
}
