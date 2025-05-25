
export enum UserRole {
  USER = 'USER',
  VIP = 'VIP',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  username: string;
  passwordHash: string; // In a real app, this would be a secure hash
  role: UserRole;
  registrationKey?: string;
}

export interface RegistrationKey {
  id: string;
  key: string;
  isUsed: boolean;
  usedBy?: string; // username of user who used it
  generatedBy: string; // Admin username
  createdAt: string;
}

export enum PostCategory {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  SCRIPT = 'SCRIPT',
  MODEL = 'MODEL',
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorUsername: string;
  category: PostCategory;
  createdAt: string;
}

export interface NavLinkItem {
  path: string;
  label: string;
  roles?: UserRole[]; // Optional: roles that can see this link
}
