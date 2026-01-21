export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  views: number;
  author: string;
  authorAvatar?: string;
  status: 'discovered' | 'processing' | 'published' | 'failed';
  progress?: number;
  eta?: number;
  badges: BadgeType[];
  createdAt: Date;
  tags: string[];
  category: string;
}

export type BadgeType = 'NEW' | 'HOT' | 'LIVE' | '4K' | 'HD';

export interface Category {
  id: string;
  name: string;
  thumbnail: string;
  videoCount: number;
}

export interface Job {
  id: string;
  videoId: string;
  status: 'pending' | 'processing' | 'uploading' | 'published' | 'failed';
  attempts: number;
  maxAttempts: number;
  progress: number;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
  isPremium: boolean;
  favorites: string[];
  watchHistory: string[];
}

export interface SearchSuggestion {
  type: 'recent' | 'trending' | 'category';
  label: string;
  value: string;
  count?: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

export interface AdminStats {
  pending: number;
  processing: number;
  failed: number;
  completed: number;
  totalVideos: number;
  activeJobs: number;
}

export interface EmbedHost {
  url: string;
  priority: number;
  available: boolean;
}

export interface VideoEmbed {
  videoId: string;
  token: string;
  expiresAt: Date;
  hosts: EmbedHost[];
}
