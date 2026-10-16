export interface Episode {
  id: number | string;
  number: number;
  title: string;
  duration: string;
  isFree: boolean;
  coinPrice: number;
  isUnlocked: boolean;
  videoUrl?: string;
  synopsis?: string;
  isPublished?: boolean;
  thumbnail?: string;
}

export interface Drama {
  id: string;
  title: string;
  subtitle: string;
  category: 'Love Story' | 'Thriller' | 'Action' | 'Drama' | 'Romance' | string;
  tags: string[];
  rating: number;
  views: string;
  totalEpisodes: number;
  freeEpisodesCount: number;
  poster: string;
  backdrop: string;
  description: string;
  director?: string;
  cast?: string[];
  trendingRank?: number;
  isRecentlyAdded?: boolean;
  isFeatured?: boolean;
  isPublished?: boolean;
  releaseDate?: string;
  genres?: string[];
  episodes: Episode[];
}

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp?: string;
  createdAt?: string;
  likes: number;
  isLiked?: boolean;
  dramaId?: string;
  episodeNumber?: number;
  isApproved?: boolean;
  isFlagged?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role?: 'user' | 'admin';
  coins: number;
  isVip: boolean;
  vipPlan?: 'none' | 'daily' | 'monthly';
  vipExpiry?: string;
  dailyStreak: number;
  lastCheckInDate?: string;
  watchTimeMinutes: number;
  claimedWatchTimeRewards: number[];
  disabled?: boolean;
  createdAt?: string;
}

export interface WatchHistoryItem {
  id?: string;
  dramaId: string;
  episodeNumber: number;
  progressPercent: number;
  lastWatchedAt: string;
  dramaTitle?: string;
  dramaPoster?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface SubscriptionItem {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  plan: 'daily' | 'monthly';
  status: 'active' | 'expired' | 'cancelled';
  amount: number;
  currency: string;
  startDate: string;
  expiryDate: string;
  paymentRef: string;
  createdAt: string;
}

export interface PaymentItem {
  id: string;
  userId: string;
  userEmail: string;
  type: 'subscription' | 'coins';
  description: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  provider: string;
  referenceId: string;
  createdAt: string;
}

export interface AdminNotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'episode' | 'coin' | 'system';
  targetUserId: string;
  dramaId?: string;
  createdAt: string;
}

export interface PlatformSettings {
  platformName: string;
  tagline: string;
  maintenanceMode: boolean;
  defaultFreeEpisodes: number;
  coinPricePerEpisode: number;
  dailyPassPrice: number;
  monthlyPassPrice: number;
  currency: string;
  announcementActive: boolean;
  announcementText: string;
}

export interface AdminStats {
  totalUsers: number;
  totalDramas: number;
  publishedDramas: number;
  totalEpisodes: number;
  publishedEpisodes: number;
  activeSubscriptions: number;
  totalRevenue: number;
  pendingComments: number;
}
