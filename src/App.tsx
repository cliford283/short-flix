import React, { useState, useEffect, useCallback } from 'react';
import {
  Smartphone,
  Maximize2,
  Grid,
  Sparkles,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { Drama, CommentItem, UserProfile, WatchHistoryItem } from './types';
import { initialDramas, initialComments } from './data/dramas';
import { api } from './services/api';

import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { VerticalPlayer } from './components/VerticalPlayer';
import { FavoritesScreen } from './components/FavoritesScreen';
import { CoinRewardCenter } from './components/CoinRewardCenter';
import { ProfileScreen } from './components/ProfileScreen';

import { EpisodeSelectorModal } from './components/EpisodeSelectorModal';
import { CommentsModal } from './components/CommentsModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { SettingsModal } from './components/SettingsModal';
import { SearchModal } from './components/SearchModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthModal, AuthScreenType } from './components/AuthModal';
import { RewardAdModal } from './components/RewardAdModal';
import { AllScreensGallery } from './components/AllScreensGallery';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [viewMode, setViewMode] = useState<'app' | 'gallery'>('app');
  const [deviceFrame, setDeviceFrame] = useState<boolean>(true);
  const [showAdminDashboard, setShowAdminDashboard] = useState<boolean>(false);

  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  const [dramas, setDramas] = useState<Drama[]>(initialDramas);
  const [activeDramaId, setActiveDramaId] = useState<string>('vagabond');
  const [activeEpisodeNumber, setActiveEpisodeNumber] = useState<number>(1);

  const [favoriteIds, setFavoriteIds] = useState<string[]>([
    'love-translated',
    'business-proposal',
    'the-glory',
  ]);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([
    {
      dramaId: 'vagabond',
      episodeNumber: 4,
      progressPercent: 85,
      lastWatchedAt: 'Just now',
    },
    {
      dramaId: 'love-translated',
      episodeNumber: 9,
      progressPercent: 60,
      lastWatchedAt: 'Yesterday',
    },
    {
      dramaId: 'business-proposal',
      episodeNumber: 2,
      progressPercent: 100,
      lastWatchedAt: '2 days ago',
    },
  ]);

  const [comments, setComments] = useState<CommentItem[]>(initialComments);

  const [user, setUser] = useState<UserProfile>({
    name: 'Darlene Robertson',
    email: 'darlene.robertson@shortflix.app',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    id: 'SF-98231',
    role: 'user',
    coins: 270,
    isVip: false,
    dailyStreak: 3,
    watchTimeMinutes: 18,
    claimedWatchTimeRewards: [10],
  });

  const [showEpisodeSelector, setShowEpisodeSelector] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showSubscription, setShowSubscription] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authScreen, setAuthScreen] = useState<AuthScreenType>('onboarding');
  const [showRewardAd, setShowRewardAd] = useState<boolean>(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const activeDrama = dramas.find((d) => d.id === activeDramaId) || dramas[0] || initialDramas[0];
  const favoriteDramas = dramas.filter((d) => favoriteIds.includes(d.id));

  const showToast = (msg: string, _type?: 'success' | 'error') => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 2500);
  };

  // Synchronize catalog & persistent data from backend
  const fetchCatalogData = useCallback(async () => {
    try {
      const dramasRes = await api.dramas.getAll();
      if (dramasRes.dramas && dramasRes.dramas.length > 0) {
        setDramas(dramasRes.dramas);
        if (!dramasRes.dramas.some((d) => d.id === activeDramaId)) {
          setActiveDramaId(dramasRes.dramas[0].id);
        }
      }
    } catch (err) {
      console.warn('Backend dramas fetch skipped or offline, using cache:', err);
    }
  }, [activeDramaId]);

  // Sync user profile & user data from backend
  const fetchUserData = useCallback(async () => {
    try {
      const meRes = await api.auth.me();
      if (meRes.user) {
        setUser(meRes.user);

        // Fetch favorites and history
        const [favRes, histRes] = await Promise.allSettled([
          api.user.getFavorites(),
          api.user.getHistory(),
        ]);
        if (favRes.status === 'fulfilled' && favRes.value.favoriteDramaIds) {
          setFavoriteIds(favRes.value.favoriteDramaIds);
        }
        if (histRes.status === 'fulfilled' && histRes.value.history) {
          setWatchHistory(histRes.value.history);
        }
      }
    } catch {
      // User not authenticated or running guest mode
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCatalogData();
    fetchUserData();
  }, [fetchCatalogData, fetchUserData]);

  // Fetch comments for active drama
  useEffect(() => {
    if (activeDramaId) {
      api.comments.getByDrama(activeDramaId, activeEpisodeNumber).then((res) => {
        if (res.comments && res.comments.length > 0) {
          setComments(res.comments);
        }
      }).catch(() => {});
    }
  }, [activeDramaId, activeEpisodeNumber]);

  const handleSelectDrama = (dramaId: string, episodeNumber: number = 1) => {
    setActiveDramaId(dramaId);
    setActiveEpisodeNumber(episodeNumber);
    setCurrentTab('foryou');

    setWatchHistory((prev) => {
      const filtered = prev.filter((item) => item.dramaId !== dramaId);
      return [
        {
          dramaId,
          episodeNumber,
          progressPercent: Math.floor(Math.random() * 40) + 40,
          lastWatchedAt: 'Just now',
        },
        ...filtered,
      ];
    });

    // Record on backend
    api.user.recordHistory(dramaId, episodeNumber, 50).catch(() => {});
  };

  const handleToggleFavorite = async (dramaId: string) => {
    if (favoriteIds.includes(dramaId)) {
      setFavoriteIds((prev) => prev.filter((id) => id !== dramaId));
      showToast('Removed from Favorites');
    } else {
      setFavoriteIds((prev) => [...prev, dramaId]);
      showToast('Added to Favorites ❤️');
    }

    try {
      await api.user.toggleFavorite(dramaId);
    } catch {
      // Local state already updated
    }
  };

  const handleUnlockEpisode = (dramaId: string, episodeNumber: number, cost: number): boolean => {
    if (user.isVip || user.role === 'admin') return true;

    if (user.coins < cost) {
      showToast('Insufficient coins! Open Coin Center.');
      return false;
    }

    // Call server to atomically verify and deduct coins
    api.dramas.unlockEpisode(dramaId, episodeNumber).then((res) => {
      if (res.remainingCoins !== undefined) {
        setUser((prev) => ({ ...prev, coins: res.remainingCoins! }));
      }
    }).catch((err) => {
      showToast(err.message || 'Unlock error', 'error');
    });

    setUser((prev) => ({ ...prev, coins: Math.max(0, prev.coins - cost) }));

    setDramas((prevDramas) =>
      prevDramas.map((drama) => {
        if (drama.id !== dramaId) return drama;
        return {
          ...drama,
          episodes: (drama.episodes || []).map((ep) =>
            ep.number === episodeNumber ? { ...ep, isUnlocked: true } : ep
          ),
        };
      })
    );

    showToast(`Episode ${episodeNumber} unlocked!`);
    return true;
  };

  const handleNextEpisode = () => {
    const totalEps = activeDrama?.totalEpisodes || activeDrama?.episodes?.length || 0;
    if (activeEpisodeNumber < totalEps) {
      const nextNum = activeEpisodeNumber + 1;
      const nextEp = (activeDrama.episodes || []).find((e) => e.number === nextNum);

      if (nextEp?.isUnlocked || nextEp?.isFree || user.isVip || user.role === 'admin') {
        setActiveEpisodeNumber(nextNum);
      } else {
        setShowEpisodeSelector(true);
      }
    }
  };

  const handlePrevEpisode = () => {
    if (activeEpisodeNumber > 1) {
      setActiveEpisodeNumber((prev) => prev - 1);
    }
  };

  const handleClaimDailyStreak = async (addedCoins: number) => {
    try {
      const res = await api.user.dailyCheckin();
      setUser((prev) => ({
        ...prev,
        coins: res.totalCoins,
        dailyStreak: res.dailyStreak,
      }));
      showToast(res.message);
    } catch {
      setUser((prev) => ({
        ...prev,
        coins: prev.coins + addedCoins,
        dailyStreak: prev.dailyStreak + 1,
      }));
      showToast(`+${addedCoins} Coins Claimed!`);
    }
  };

  const handleClaimWatchReward = async (milestoneMinutes: number, rewardCoins: number) => {
    try {
      const res = await api.user.claimReward('watchTime', rewardCoins);
      setUser((prev) => ({
        ...prev,
        coins: res.coins,
        claimedWatchTimeRewards: [...prev.claimedWatchTimeRewards, milestoneMinutes],
      }));
      showToast(res.message);
    } catch {
      setUser((prev) => ({
        ...prev,
        coins: prev.coins + rewardCoins,
        claimedWatchTimeRewards: [...prev.claimedWatchTimeRewards, milestoneMinutes],
      }));
      showToast(`+${rewardCoins} Coins Claimed!`);
    }
  };

  const handleBuyCoins = async (addedCoins: number, price: string) => {
    try {
      const priceNum = parseFloat(price.replace('$', '')) || 0.99;
      const res = await api.user.buyCoins({
        bundleId: `bundle-${addedCoins}`,
        coins: addedCoins,
        bonusCoins: 0,
        priceUsd: priceNum,
      });
      setUser(res.user);
      showToast(res.message);
    } catch {
      setUser((prev) => ({ ...prev, coins: prev.coins + addedCoins }));
      showToast(`Purchased ${addedCoins} Coins for ${price}!`);
    }
  };

  const handleUpgradeToVip = async (plan: 'daily' | 'monthly', paymentProvider?: string) => {
    try {
      const res = await api.user.subscribe(plan, paymentProvider);
      setUser(res.user);
      showToast(res.message);
    } catch {
      setUser((prev) => ({
        ...prev,
        isVip: true,
        vipPlan: plan,
        vipExpiry: plan === 'daily' ? 'Tomorrow' : 'In 30 days',
      }));
      showToast(`${plan === 'daily' ? 'Daily Pass' : 'Monthly VIP Pass'} Activated! 👑`);
    }
  };

  const handleAddComment = async (content: string) => {
    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      author: user.name,
      avatar: user.avatar,
      content,
      timestamp: 'Just now',
      likes: 1,
      isLiked: true,
    };
    setComments((prev) => [newComment, ...prev]);

    try {
      await api.comments.post(activeDramaId, content, activeEpisodeNumber);
    } catch {
      // Local state already updated
    }
    showToast('Comment posted! 💬');
  };

  const handleToggleCommentLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const isLiked = !c.isLiked;
        return {
          ...c,
          isLiked,
          likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
        };
      })
    );
    api.comments.like(commentId).catch(() => {});
  };

  const handleNavigateFromGallery = (screenId: string) => {
    setViewMode('app');
    if (['splash', 'onboarding', 'signin', 'signup', 'verify'].includes(screenId)) {
      setAuthScreen(screenId as AuthScreenType);
      setShowAuthModal(true);
    } else if (screenId === 'home') {
      setCurrentTab('home');
    } else if (screenId.startsWith('category')) {
      setCurrentTab('home');
    } else if (screenId === 'favorites-empty') {
      setFavoriteIds([]);
      setCurrentTab('favorites');
    } else if (screenId === 'favorites' || screenId === 'history') {
      setCurrentTab('favorites');
    } else if (screenId === 'foryou') {
      setCurrentTab('foryou');
    } else if (screenId === 'episodes') {
      setCurrentTab('foryou');
      setShowEpisodeSelector(true);
    } else if (screenId === 'comments') {
      setCurrentTab('foryou');
      setShowComments(true);
    } else if (screenId === 'profile') {
      setCurrentTab('profile');
    } else if (screenId === 'settings') {
      setShowSettings(true);
    } else if (screenId === 'subscription') {
      setShowSubscription(true);
    } else if (screenId === 'coins' || screenId === 'daily-rewards') {
      setCurrentTab('coins');
    } else if (screenId === 'search') {
      setShowSearch(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070A] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Floating App Bar */}
      <header className="h-14 bg-[#0F0F16]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between z-40 sticky top-0 shadow-lg">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF3B30] to-[#FF8C00] flex items-center justify-center shadow-lg shadow-orange-950/40">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-extrabold text-white tracking-tight font-['Bricolage_Grotesque']">
            Short<span className="text-[#FA4D1E]">Flix</span>
          </span>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5 font-medium">
            K-Drama & Mini-Series
          </span>
        </div>

        {/* Global Controls & Views */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center p-1 bg-white/5 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('app')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'app'
                  ? 'bg-[#FA4D1E] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Interactive App</span>
            </button>
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'gallery'
                  ? 'bg-[#FA4D1E] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>All 20 Screens</span>
            </button>
          </div>

          {viewMode === 'app' && (
            <button
              onClick={() => setDeviceFrame((prev) => !prev)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
            >
              {deviceFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              <span>{deviceFrame ? 'Full Screen' : 'iPhone Frame'}</span>
            </button>
          )}

          {/* Admin Dashboard Trigger */}
          <button
            onClick={() => setShowAdminDashboard(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF4500] to-[#FF8C00] hover:brightness-110 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-orange-950/40 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {globalToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#FA4D1E] text-white text-xs font-bold rounded-full shadow-2xl animate-fade-in flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          {globalToast}
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-x-hidden">
        {viewMode === 'gallery' ? (
          <AllScreensGallery
            dramas={dramas}
            user={user}
            onNavigateToScreen={handleNavigateFromGallery}
          />
        ) : (
          <div
            className={`w-full transition-all duration-300 ${
              deviceFrame
                ? 'max-w-[400px] my-4 md:my-6 rounded-[48px] border-[10px] border-[#1E1E28] shadow-[0_25px_80px_rgba(0,0,0,0.9)] bg-[#0C0C10] flex flex-col overflow-hidden relative min-h-[820px] max-h-[860px]'
                : 'max-w-md mx-auto w-full min-h-[calc(100vh-60px)] flex flex-col bg-[#0C0C10] shadow-2xl relative'
            }`}
          >
            {/* Status Bar with Dynamic Island */}
            {deviceFrame && (
              <div className="w-full pt-3 pb-1 px-7 flex items-center justify-between text-[11px] font-semibold text-slate-400 select-none bg-[#0C0C10] z-40">
                <span>9:41</span>
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end pr-2 border border-white/10 shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/20" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            {/* In-App Header (hidden on vertical player) */}
            {currentTab !== 'foryou' && (
              <Header
                coins={user.coins}
                onOpenSearch={() => setShowSearch(true)}
                onOpenNotifications={() => setShowNotifications(true)}
                onOpenCoins={() => setCurrentTab('coins')}
                onOpenVip={() => setShowSubscription(true)}
                isVip={user.isVip}
              />
            )}

            {/* Tab Views */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {currentTab === 'home' && (
                <HomeScreen
                  dramas={dramas}
                  watchHistory={watchHistory}
                  onSelectDrama={handleSelectDrama}
                  onOpenEpisodes={(d) => {
                    setActiveDramaId(d.id);
                    setShowEpisodeSelector(true);
                  }}
                />
              )}

              {currentTab === 'foryou' && (
                <VerticalPlayer
                  drama={activeDrama}
                  currentEpisodeNumber={activeEpisodeNumber}
                  isFavorited={favoriteIds.includes(activeDrama.id)}
                  onToggleFavorite={() => handleToggleFavorite(activeDrama.id)}
                  onOpenEpisodes={() => setShowEpisodeSelector(true)}
                  onOpenComments={() => setShowComments(true)}
                  onNextEpisode={handleNextEpisode}
                  onPrevEpisode={handlePrevEpisode}
                  onBack={() => setCurrentTab('home')}
                  onOpenVip={() => setShowSubscription(true)}
                  onOpenSearch={() => setShowSearch(true)}
                  onOpenNotifications={() => setShowNotifications(true)}
                  isVip={user.isVip}
                />
              )}

              {currentTab === 'favorites' && (
                <FavoritesScreen
                  favoriteDramas={favoriteDramas}
                  watchHistory={watchHistory}
                  allDramas={dramas}
                  onSelectDrama={handleSelectDrama}
                  onRemoveFavorite={(id) => handleToggleFavorite(id)}
                  onClearHistory={async () => {
                    setWatchHistory([]);
                    await api.user.clearHistory().catch(() => {});
                  }}
                  onExploreGallery={() => setCurrentTab('home')}
                />
              )}

              {currentTab === 'coins' && (
                <CoinRewardCenter
                  user={user}
                  onClaimDailyStreak={handleClaimDailyStreak}
                  onClaimWatchReward={handleClaimWatchReward}
                  onWatchAd={() => setShowRewardAd(true)}
                  onBuyCoins={handleBuyCoins}
                  onWatchMore={() => setCurrentTab('foryou')}
                />
              )}

              {currentTab === 'profile' && (
                <ProfileScreen
                  user={user}
                  favoritesCount={favoriteIds.length}
                  historyCount={watchHistory.length}
                  onOpenSettings={() => setShowSettings(true)}
                  onOpenSubscription={() => setShowSubscription(true)}
                  onOpenCoins={() => setCurrentTab('coins')}
                  onOpenFavorites={() => setCurrentTab('favorites')}
                  onOpenHistory={() => setCurrentTab('favorites')}
                  onOpenAdmin={() => setShowAdminDashboard(true)}
                  onSignOut={() => {
                    api.auth.logout();
                    setAuthScreen('signin');
                    setShowAuthModal(true);
                  }}
                />
              )}
            </div>

            {/* Bottom 5 Tabs Navigation */}
            <BottomNav
              currentTab={currentTab}
              onSelectTab={(tab) => setCurrentTab(tab)}
              favoritesCount={favoriteIds.length}
            />

            {/* Home indicator bar for phone frame */}
            {deviceFrame && (
              <div className="w-full pb-2 pt-1 flex justify-center bg-[#0F0F15] select-none">
                <div className="w-32 h-1 bg-white/30 rounded-full" />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Admin Dashboard Full Screen Modal */}
      {showAdminDashboard && (
        <AdminDashboard
          currentUser={user}
          onClose={() => setShowAdminDashboard(false)}
          onRefreshPublicData={fetchCatalogData}
        />
      )}

      {/* Drawers & Modals */}
      {showEpisodeSelector && (
        <EpisodeSelectorModal
          drama={activeDrama}
          currentEpisode={activeEpisodeNumber}
          userCoins={user.coins}
          isVip={user.isVip}
          onSelectEpisode={(epNum) => {
            setActiveEpisodeNumber(epNum);
            setCurrentTab('foryou');
          }}
          onUnlockEpisode={handleUnlockEpisode}
          onClose={() => setShowEpisodeSelector(false)}
          onOpenCoinStore={() => {
            setShowEpisodeSelector(false);
            setCurrentTab('coins');
          }}
        />
      )}

      {showComments && (
        <CommentsModal
          comments={comments}
          dramaTitle={activeDrama.title}
          episodeNumber={activeEpisodeNumber}
          userName={user.name}
          onAddComment={handleAddComment}
          onToggleLike={handleToggleCommentLike}
          onClose={() => setShowComments(false)}
        />
      )}

      {showSubscription && (
        <SubscriptionModal
          isVip={user.isVip}
          vipExpiry={user.vipExpiry}
          onUpgradeToVip={handleUpgradeToVip}
          onClose={() => setShowSubscription(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          onOpenSubscription={() => {
            setShowSettings(false);
            setShowSubscription(true);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showSearch && (
        <SearchModal
          dramas={dramas}
          onSelectDrama={handleSelectDrama}
          onClose={() => setShowSearch(false)}
        />
      )}

      {showNotifications && (
        <NotificationsModal
          onClose={() => setShowNotifications(false)}
          onOpenDrama={(id) => handleSelectDrama(id, 1)}
          onOpenCoins={() => setCurrentTab('coins')}
        />
      )}

      {showAuthModal && (
        <AuthModal
          initialScreen={authScreen}
          onSuccess={(userData) => {
            setUser((prev) => ({
              ...prev,
              name: userData.name,
              email: userData.email,
              role: (userData as any).role || 'user',
            }));
            fetchUserData();
            showToast(`Welcome back, ${userData.name}!`);
          }}
          onClose={() => setShowAuthModal(false)}
          posterPreviews={dramas.map((d) => d.poster)}
        />
      )}

      {showRewardAd && (
        <RewardAdModal
          onComplete={async (reward) => {
            setShowRewardAd(false);
            try {
              const res = await api.user.claimReward('ad', reward);
              setUser((prev) => ({ ...prev, coins: res.coins }));
              showToast(res.message);
            } catch {
              setUser((prev) => ({ ...prev, coins: prev.coins + reward }));
              showToast(`+${reward} Coins Earned from Sponsor Video! 💰`);
            }
          }}
          onClose={() => setShowRewardAd(false)}
        />
      )}
    </div>
  );
}
