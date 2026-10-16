import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  coins: number;
  isVip: boolean;
  vipPlan?: 'none' | 'daily' | 'monthly';
  vipExpiry?: string;
  dailyStreak: number;
  lastCheckInDate?: string;
  watchTimeMinutes: number;
  claimedWatchTimeRewards: number[];
  avatar: string;
  createdAt: string;
  disabled?: boolean;
}

export interface EpisodeEntity {
  id: string;
  dramaId: string;
  number: number;
  title: string;
  synopsis: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
  isFree: boolean;
  coinPrice: number;
  isPublished: boolean;
  views: number;
  createdAt: string;
}

export interface DramaEntity {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Love Story' | 'Thriller' | 'Action' | 'Drama' | 'Romance';
  genres: string[];
  tags: string[];
  poster: string;
  backdrop: string;
  director: string;
  cast: string[];
  releaseDate: string;
  rating: number;
  views: string;
  trendingRank?: number;
  isFeatured: boolean;
  isRecentlyAdded: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryEntity {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export interface UserFavoriteEntity {
  id: string;
  userId: string;
  dramaId: string;
  createdAt: string;
}

export interface UserWatchHistoryEntity {
  id: string;
  userId: string;
  dramaId: string;
  episodeNumber: number;
  progressPercent: number;
  lastWatchedAt: string;
}

export interface SubscriptionEntity {
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

export interface PaymentRecordEntity {
  id: string;
  userId: string;
  userEmail: string;
  type: 'subscription' | 'coins';
  description: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  provider: 'Stripe (Manual)' | 'PayPal (Manual)' | 'Credit Card' | 'Coin Balance';
  referenceId: string;
  createdAt: string;
}

export interface CommentEntity {
  id: string;
  dramaId: string;
  episodeNumber: number;
  userId: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  isApproved: boolean;
  isFlagged: boolean;
  createdAt: string;
}

export interface NotificationEntity {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'episode' | 'coin' | 'system';
  targetUserId: string; // 'all' or specific userId
  dramaId?: string;
  createdAt: string;
}

export interface PlatformSettingsEntity {
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

export interface DatabaseSchema {
  users: UserEntity[];
  dramas: DramaEntity[];
  episodes: EpisodeEntity[];
  categories: CategoryEntity[];
  favorites: UserFavoriteEntity[];
  watchHistory: UserWatchHistoryEntity[];
  subscriptions: SubscriptionEntity[];
  payments: PaymentRecordEntity[];
  comments: CommentEntity[];
  notifications: NotificationEntity[];
  settings: PlatformSettingsEntity;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'shortflix_db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getDefaultData(): DatabaseSchema {
  const adminPasswordHash = bcrypt.hashSync('Admin@ShortFlix2026', 10);
  const userPasswordHash = bcrypt.hashSync('Password123!', 10);

  const initialDramasData: DramaEntity[] = [
    {
      id: 'vagabond',
      title: 'Vagabond',
      subtitle: 'Thrilling Series',
      description: 'Vagabond is a South Korean action thriller television series broadcast on SBS and globally distributed by Netflix. Stuntman Cha Dal-gun gets entangled in a devastating plane crash investigation, uncovering a terrifying web of national corruption.',
      category: 'Action',
      genres: ['Action', 'Thriller', 'Suspense'],
      tags: ['Action', 'Mystery', 'Crime', 'Revenge'],
      poster: '/src/assets/images/poster_vagabond_action_1792132925240.jpg',
      backdrop: '/src/assets/images/player_actress_vagabond_1792133714675.jpg',
      director: 'Yoo In-sik',
      cast: ['Lee Seung-gi', 'Bae Suzy', 'Shin Sung-rok'],
      releaseDate: '2024-09-15',
      rating: 9.6,
      views: '12.4M',
      trendingRank: 1,
      isFeatured: true,
      isRecentlyAdded: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'love-translated',
      title: 'Love Translated',
      subtitle: 'A Modern Romance Series',
      description: 'A brilliant multilingual interpreter finds herself assigned to an introverted tech CEO who refuses to speak openly. Between translated words and unspoken emotions, an impossible spark ignites across Seoul twilight.',
      category: 'Love Story',
      genres: ['Romance', 'Drama', 'Comedy'],
      tags: ['Romance', 'Heartwarming', 'K-Drama', 'Destiny'],
      poster: '/src/assets/images/poster_romance_drama_1792132924947.jpg',
      backdrop: '/src/assets/images/poster_romance_drama_1792132924947.jpg',
      director: 'Kim Jin-min',
      cast: ['Yuna Park', 'Kenji Seo', 'Han So-hee'],
      releaseDate: '2024-10-01',
      rating: 9.8,
      views: '18.9M',
      trendingRank: 2,
      isFeatured: false,
      isRecentlyAdded: true,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'the-glory',
      title: 'The Glory',
      subtitle: 'Vengeance Begins',
      description: 'Years after surviving horrific abuse in high school, a woman puts into motion an elaborate revenge scheme to make the perpetrators pay for their crimes down to the very last breath.',
      category: 'Thriller',
      genres: ['Thriller', 'Suspense', 'Drama'],
      tags: ['Thriller', 'Revenge', 'Psychological', 'Dark'],
      poster: '/src/assets/images/poster_revenge_thriller_1792132925871.jpg',
      backdrop: '/src/assets/images/poster_revenge_thriller_1792132925871.jpg',
      director: 'Ahn Gil-ho',
      cast: ['Song Hye-kyo', 'Lee Do-hyun', 'Lim Ji-yeon'],
      releaseDate: '2024-08-20',
      rating: 9.7,
      views: '24.1M',
      trendingRank: 3,
      isFeatured: false,
      isRecentlyAdded: true,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'business-proposal',
      title: 'Business Proposal',
      subtitle: 'A Modern Luxury Romance',
      description: 'In disguise as her wealthy friend, Shin Ha-ri shows up to a blind date to scare the suitor away. The plan backfires completely when the man turns out to be her company CEO, and he makes an unexpected proposal.',
      category: 'Love Story',
      genres: ['Romance', 'Comedy', 'Drama'],
      tags: ['Romance', 'Comedy', 'CEO', 'Contract Love'],
      poster: '/src/assets/images/poster_ceo_romance_1792132925740.jpg',
      backdrop: '/src/assets/images/poster_ceo_romance_1792132925740.jpg',
      director: 'Park Seon-ho',
      cast: ['Ahn Hyo-seop', 'Kim Se-jeong', 'Kim Min-kyu'],
      releaseDate: '2024-09-28',
      rating: 9.5,
      views: '15.3M',
      trendingRank: 4,
      isFeatured: false,
      isRecentlyAdded: true,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Initial episodes generator for dramas
  const initialEpisodesData: EpisodeEntity[] = [];
  const videoUrls = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  ];

  initialDramasData.forEach((drama) => {
    const epCount = drama.id === 'vagabond' ? 45 : drama.id === 'the-glory' ? 32 : 36;
    const freeCount = 9;

    for (let i = 1; i <= epCount; i++) {
      initialEpisodesData.push({
        id: `${drama.id}-ep-${i}`,
        dramaId: drama.id,
        number: i,
        title: `Episode ${i}: Chapter ${i}`,
        synopsis: `Episode ${i} reveals gripping drama and pivotal confrontations in ${drama.title}.`,
        duration: '1:45',
        videoUrl: videoUrls[(i - 1) % videoUrls.length],
        thumbnail: drama.poster,
        isFree: i <= freeCount,
        coinPrice: i <= freeCount ? 0 : 28,
        isPublished: true,
        views: Math.floor(Math.random() * 50000) + 12000,
        createdAt: new Date().toISOString(),
      });
    }
  });

  return {
    users: [
      {
        id: 'usr-admin-01',
        name: 'ShortFlix Administrator',
        email: 'admin@shortflix.app',
        passwordHash: adminPasswordHash,
        role: 'admin',
        coins: 9999,
        isVip: true,
        vipPlan: 'monthly',
        vipExpiry: '2028-12-31T23:59:59.000Z',
        dailyStreak: 30,
        watchTimeMinutes: 120,
        claimedWatchTimeRewards: [10, 20, 40, 60],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr-darlene-02',
        name: 'Darlene Robertson',
        email: 'darlene@example.com',
        passwordHash: userPasswordHash,
        role: 'user',
        coins: 270,
        isVip: false,
        vipPlan: 'none',
        dailyStreak: 3,
        watchTimeMinutes: 18,
        claimedWatchTimeRewards: [10],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
      },
    ],
    dramas: initialDramasData,
    episodes: initialEpisodesData,
    categories: [
      { id: 'cat-love', name: 'Love Story', slug: 'love-story', description: 'Romantic tales, destiny, and emotional chemistry.' },
      { id: 'cat-thriller', name: 'Thriller', slug: 'thriller', description: 'High-stakes suspense, conspiracies, and revenge.' },
      { id: 'cat-action', name: 'Action', slug: 'action', description: 'Fast-paced martial arts, undercover agents, and chases.' },
      { id: 'cat-drama', name: 'Drama', slug: 'drama', description: 'Intense family, corporate, and relational storytelling.' },
    ],
    favorites: [
      { id: 'fav-1', userId: 'usr-darlene-02', dramaId: 'love-translated', createdAt: new Date().toISOString() },
      { id: 'fav-2', userId: 'usr-darlene-02', dramaId: 'business-proposal', createdAt: new Date().toISOString() },
    ],
    watchHistory: [
      { id: 'hist-1', userId: 'usr-darlene-02', dramaId: 'vagabond', episodeNumber: 4, progressPercent: 85, lastWatchedAt: new Date().toISOString() },
      { id: 'hist-2', userId: 'usr-darlene-02', dramaId: 'love-translated', episodeNumber: 9, progressPercent: 60, lastWatchedAt: new Date().toISOString() },
    ],
    subscriptions: [
      {
        id: 'sub-sample-01',
        userId: 'usr-darlene-02',
        userEmail: 'darlene@example.com',
        userName: 'Darlene Robertson',
        plan: 'monthly',
        status: 'expired',
        amount: 30,
        currency: 'USD',
        startDate: '2024-08-01T00:00:00.000Z',
        expiryDate: '2024-09-01T00:00:00.000Z',
        paymentRef: 'PAY-ORD-98214',
        createdAt: '2024-08-01T00:00:00.000Z',
      },
    ],
    payments: [
      {
        id: 'pay-01',
        userId: 'usr-darlene-02',
        userEmail: 'darlene@example.com',
        type: 'subscription',
        description: 'Monthly Pass VIP Subscription',
        amount: 30,
        currency: 'USD',
        status: 'completed',
        provider: 'Credit Card',
        referenceId: 'TXN-98214-CC',
        createdAt: '2024-08-01T00:00:00.000Z',
      },
      {
        id: 'pay-02',
        userId: 'usr-darlene-02',
        userEmail: 'darlene@example.com',
        type: 'coins',
        description: '600 Coins + 90 Bonus Package',
        amount: 4.99,
        currency: 'USD',
        status: 'completed',
        provider: 'Credit Card',
        referenceId: 'TXN-55102-COINS',
        createdAt: '2024-09-12T14:32:00.000Z',
      },
    ],
    comments: [
      {
        id: 'c1',
        dramaId: 'vagabond',
        episodeNumber: 1,
        userId: 'usr-darlene-02',
        author: 'Min-ji Kim',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        content: 'The plot twist at the end of Episode 8 gave me literal chills! Dal-gun cannot trust anyone! 😱🔥',
        likes: 1240,
        isApproved: true,
        isFlagged: false,
        createdAt: '2024-10-10T12:00:00.000Z',
      },
      {
        id: 'c2',
        dramaId: 'vagabond',
        episodeNumber: 1,
        userId: 'usr-darlene-02',
        author: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        content: 'Vertical drama pacing is so addictive. Binge-watched 12 episodes in one sitting!',
        likes: 685,
        isApproved: true,
        isFlagged: false,
        createdAt: '2024-10-12T15:20:00.000Z',
      },
    ],
    notifications: [
      {
        id: 'notif-1',
        title: 'Welcome to ShortFlix!',
        message: 'Explore trending vertical K-Dramas and claim daily coin rewards.',
        type: 'announcement',
        targetUserId: 'all',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-2',
        title: 'New Episode Drop: Vagabond Ep. 10',
        message: 'Cha Dal-gun faces a deadly ambush in the docks. Watch now!',
        type: 'episode',
        targetUserId: 'all',
        dramaId: 'vagabond',
        createdAt: new Date().toISOString(),
      },
    ],
    settings: {
      platformName: 'ShortFlix',
      tagline: 'Vertical Drama & Mini-Series Streaming',
      maintenanceMode: false,
      defaultFreeEpisodes: 9,
      coinPricePerEpisode: 28,
      dailyPassPrice: 4.99,
      monthlyPassPrice: 29.99,
      currency: 'USD',
      announcementActive: false,
      announcementText: '🎉 Welcome to ShortFlix! Enjoy unlimited episodes with VIP.',
    },
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading database file, resetting to defaults:', err);
    }
    const defaults = getDefaultData();
    this.save(defaults);
    return defaults;
  }

  private save(dataToSave: DatabaseSchema) {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  public get(): DatabaseSchema {
    return this.data;
  }

  public update(updater: (db: DatabaseSchema) => void) {
    updater(this.data);
    this.save(this.data);
  }
}

export const db = new Database();
