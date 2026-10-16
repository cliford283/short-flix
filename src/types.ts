export interface Episode {
  id: number;
  number: number;
  title: string;
  duration: string;
  isFree: boolean;
  coinPrice: number;
  isUnlocked: boolean;
  videoUrl?: string;
  synopsis?: string;
}

export interface Drama {
  id: string;
  title: string;
  subtitle: string;
  category: 'Love Story' | 'Thriller' | 'Action' | 'Drama' | 'Romance';
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
  genres?: string[];
  episodes: Episode[];
}

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  id: string;
  coins: number;
  isVip: boolean;
  vipExpiry?: string;
  dailyStreak: number;
  lastCheckInDate?: string;
  watchTimeMinutes: number;
  claimedWatchTimeRewards: number[];
}

export interface WatchHistoryItem {
  dramaId: string;
  episodeNumber: number;
  progressPercent: number;
  lastWatchedAt: string;
}
