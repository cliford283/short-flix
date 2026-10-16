import {
  Drama,
  Episode,
  CommentItem,
  UserProfile,
  WatchHistoryItem,
  CategoryItem,
  SubscriptionItem,
  PaymentItem,
  AdminNotificationItem,
  PlatformSettings,
  AdminStats,
} from '../types';

const TOKEN_KEY = 'shortflix_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  auth: {
    login: async (email: string, password: string) => {
      const res = await request<{ token: string; user: UserProfile }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setStoredToken(res.token);
      return res;
    },
    adminLogin: async (email: string, password: string) => {
      const res = await request<{ token: string; user: UserProfile }>('/api/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setStoredToken(res.token);
      return res;
    },
    register: async (name: string, email: string, password: string) => {
      const res = await request<{ token: string; user: UserProfile }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      setStoredToken(res.token);
      return res;
    },
    me: async () => {
      return request<{ user: UserProfile }>('/api/auth/me');
    },
    logout: () => {
      setStoredToken(null);
    },
  },

  // Public Dramas
  dramas: {
    getAll: async (params?: { category?: string; genre?: string; search?: string; all?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.genre) query.set('genre', params.genre);
      if (params?.search) query.set('search', params.search);
      if (params?.all) query.set('all', 'true');
      const url = `/api/dramas${query.toString() ? `?${query.toString()}` : ''}`;
      return request<{ dramas: Drama[] }>(url);
    },
    getById: async (id: string) => {
      return request<{ drama: Drama }>(`/api/dramas/${id}`);
    },
    getEpisodes: async (id: string) => {
      return request<{ episodes: Episode[] }>(`/api/dramas/${id}/episodes`);
    },
    unlockEpisode: async (dramaId: string, episodeNumber: number) => {
      return request<{ success: boolean; message: string; remainingCoins?: number; videoUrl?: string }>(
        `/api/dramas/${dramaId}/episodes/${episodeNumber}/unlock`,
        { method: 'POST' }
      );
    },
  },

  // User Features
  user: {
    getProfile: async () => {
      return request<{ user: UserProfile }>('/api/user/profile');
    },
    updateProfile: async (name: string, avatar?: string) => {
      return request<{ user: UserProfile; message: string }>('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, avatar }),
      });
    },
    getFavorites: async () => {
      return request<{ favoriteDramaIds: string[]; dramas: Drama[] }>('/api/user/favorites');
    },
    toggleFavorite: async (dramaId: string) => {
      return request<{ isFavorited: boolean; message: string }>(`/api/user/favorites/${dramaId}`, {
        method: 'POST',
      });
    },
    getHistory: async () => {
      return request<{ history: WatchHistoryItem[] }>('/api/user/history');
    },
    recordHistory: async (dramaId: string, episodeNumber: number, progressPercent?: number) => {
      return request<{ success: boolean }>('/api/user/history', {
        method: 'POST',
        body: JSON.stringify({ dramaId, episodeNumber, progressPercent }),
      });
    },
    clearHistory: async () => {
      return request<{ success: boolean }>('/api/user/history', { method: 'DELETE' });
    },
    dailyCheckin: async () => {
      return request<{ success: boolean; rewardCoins: number; dailyStreak: number; totalCoins: number; message: string }>(
        '/api/user/daily-checkin',
        { method: 'POST' }
      );
    },
    claimReward: async (rewardType: 'ad' | 'watchTime', amount: number) => {
      return request<{ success: boolean; awarded: number; coins: number; message: string }>(
        '/api/user/claim-reward',
        { method: 'POST', body: JSON.stringify({ rewardType, amount }) }
      );
    },
    subscribe: async (plan: 'daily' | 'monthly', paymentMethod = 'Credit Card') => {
      return request<{ success: boolean; user: UserProfile; subscription: SubscriptionItem; message: string }>(
        '/api/user/subscribe',
        { method: 'POST', body: JSON.stringify({ plan, paymentMethod }) }
      );
    },
    buyCoins: async (bundle: { bundleId: string; coins: number; bonusCoins: number; priceUsd: number }) => {
      return request<{ success: boolean; user: UserProfile; addedCoins: number; totalCoins: number; message: string }>(
        '/api/user/buy-coins',
        { method: 'POST', body: JSON.stringify(bundle) }
      );
    },
  },

  // Comments
  comments: {
    getByDrama: async (dramaId: string, episodeNumber?: number) => {
      const url = `/api/comments/${dramaId}${episodeNumber ? `?episodeNumber=${episodeNumber}` : ''}`;
      return request<{ comments: CommentItem[] }>(url);
    },
    post: async (dramaId: string, content: string, episodeNumber: number = 1) => {
      return request<{ comment: CommentItem; message: string }>(`/api/comments/${dramaId}`, {
        method: 'POST',
        body: JSON.stringify({ content, episodeNumber }),
      });
    },
    like: async (commentId: string) => {
      return request<{ success: boolean; likes: number }>(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });
    },
  },

  // Notifications
  notifications: {
    getAll: async () => {
      return request<{ notifications: AdminNotificationItem[]; announcement: { active: boolean; text: string } | null }>(
        '/api/notifications'
      );
    },
  },

  // Administrator API
  admin: {
    getStats: async () => {
      return request<{
        stats: AdminStats;
        recentPayments: PaymentItem[];
        topDramas: { id: string; title: string; category: string; views: string; rating: number; episodesCount: number }[];
      }>('/api/admin/stats');
    },

    // Drama CRUD
    createDrama: async (dramaData: Partial<Drama>) => {
      return request<{ drama: Drama; message: string }>('/api/dramas/admin/dramas', {
        method: 'POST',
        body: JSON.stringify(dramaData),
      });
    },
    updateDrama: async (id: string, dramaData: Partial<Drama>) => {
      return request<{ drama: Drama; message: string }>(`/api/dramas/admin/dramas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dramaData),
      });
    },
    deleteDrama: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/api/dramas/admin/dramas/${id}`, {
        method: 'DELETE',
      });
    },

    // Episode CRUD
    createEpisode: async (dramaId: string, episodeData: Partial<Episode>) => {
      return request<{ episode: Episode; message: string }>(`/api/dramas/admin/dramas/${dramaId}/episodes`, {
        method: 'POST',
        body: JSON.stringify(episodeData),
      });
    },
    updateEpisode: async (id: string, episodeData: Partial<Episode>) => {
      return request<{ episode: Episode; message: string }>(`/api/dramas/admin/episodes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(episodeData),
      });
    },
    deleteEpisode: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/api/dramas/admin/episodes/${id}`, {
        method: 'DELETE',
      });
    },
    reorderEpisodes: async (orderedEpisodeIds: string[]) => {
      return request<{ success: boolean; message: string }>('/api/dramas/admin/episodes/reorder', {
        method: 'POST',
        body: JSON.stringify({ orderedEpisodeIds }),
      });
    },

    // Users
    getUsers: async (params?: { search?: string; role?: string; status?: string }) => {
      const q = new URLSearchParams();
      if (params?.search) q.set('search', params.search);
      if (params?.role) q.set('role', params.role);
      if (params?.status) q.set('status', params.status);
      const url = `/api/admin/users${q.toString() ? `?${q.toString()}` : ''}`;
      return request<{ users: UserProfile[] }>(url);
    },
    updateUser: async (id: string, data: Partial<UserProfile> & { password?: string }) => {
      return request<{ user: UserProfile; message: string }>(`/api/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    deleteUser: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
    },

    // Categories
    getCategories: async () => {
      return request<{ categories: CategoryItem[] }>('/api/admin/categories');
    },
    createCategory: async (data: { name: string; description?: string }) => {
      return request<{ category: CategoryItem; message: string }>('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    updateCategory: async (id: string, data: { name?: string; description?: string }) => {
      return request<{ category: CategoryItem; message: string }>(`/api/admin/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    deleteCategory: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
    },

    // Subscriptions
    getSubscriptions: async (params?: { status?: string; plan?: string }) => {
      const q = new URLSearchParams();
      if (params?.status) q.set('status', params.status);
      if (params?.plan) q.set('plan', params.plan);
      return request<{ subscriptions: SubscriptionItem[] }>(`/api/admin/subscriptions?${q.toString()}`);
    },
    grantSubscription: async (userId: string, plan: 'daily' | 'monthly', durationDays: number) => {
      return request<{ success: boolean; message: string }>('/api/admin/subscriptions/grant', {
        method: 'POST',
        body: JSON.stringify({ userId, plan, durationDays }),
      });
    },
    cancelSubscription: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/api/admin/subscriptions/${id}/cancel`, {
        method: 'PUT',
      });
    },

    // Payments
    getPayments: async (params?: { type?: string; status?: string }) => {
      const q = new URLSearchParams();
      if (params?.type) q.set('type', params.type);
      if (params?.status) q.set('status', params.status);
      return request<{ payments: PaymentItem[] }>(`/api/admin/payments?${q.toString()}`);
    },

    // Comments Moderation
    getComments: async (flaggedOnly?: boolean) => {
      return request<{ comments: CommentItem[] }>(`/api/admin/comments${flaggedOnly ? '?flaggedOnly=true' : ''}`);
    },
    moderateComment: async (id: string, isApproved?: boolean, isFlagged?: boolean) => {
      return request<{ success: boolean; message: string }>(`/api/admin/comments/${id}/moderate`, {
        method: 'PUT',
        body: JSON.stringify({ isApproved, isFlagged }),
      });
    },
    deleteComment: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/api/admin/comments/${id}`, {
        method: 'DELETE',
      });
    },

    // Notifications
    getNotifications: async () => {
      return request<{ notifications: AdminNotificationItem[] }>('/api/admin/notifications');
    },
    createNotification: async (data: { title: string; message: string; type?: string; dramaId?: string }) => {
      return request<{ notification: AdminNotificationItem; message: string }>('/api/admin/notifications', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    deleteNotification: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/api/admin/notifications/${id}`, {
        method: 'DELETE',
      });
    },

    // Settings
    getSettings: async () => {
      return request<{ settings: PlatformSettings }>('/api/admin/settings');
    },
    updateSettings: async (settings: Partial<PlatformSettings>) => {
      return request<{ settings: PlatformSettings; message: string }>('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    },
  },
};
