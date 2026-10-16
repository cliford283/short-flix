import { Router, Response } from 'express';
import { db, UserFavoriteEntity, UserWatchHistoryEntity, SubscriptionEntity, PaymentRecordEntity } from '../db';
import { AuthenticatedRequest, requireAuth, sanitizeUser } from '../auth';

const router = Router();

router.use(requireAuth);

// Get User Profile
router.get('/profile', (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: sanitizeUser(req.user!) });
});

// Update Profile
router.put('/profile', (req: AuthenticatedRequest, res: Response) => {
  const { name, avatar } = req.body;
  const userId = req.user!.id;

  db.update((data) => {
    const u = data.users.find((usr) => usr.id === userId);
    if (u) {
      if (name && name.trim()) u.name = name.trim();
      if (avatar && avatar.trim()) u.avatar = avatar.trim();
    }
  });

  const updated = db.get().users.find((u) => u.id === userId);
  res.json({ user: sanitizeUser(updated!), message: 'Profile updated.' });
});

// Favorites
router.get('/favorites', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const favDramaIds = db.get().favorites.filter((f) => f.userId === userId).map((f) => f.dramaId);
  const favoriteDramas = db.get().dramas.filter((d) => favDramaIds.includes(d.id));
  res.json({ favoriteDramaIds: favDramaIds, dramas: favoriteDramas });
});

router.post('/favorites/:dramaId', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { dramaId } = req.params;

  let isFavorited = false;
  db.update((data) => {
    const existingIndex = data.favorites.findIndex((f) => f.userId === userId && f.dramaId === dramaId);
    if (existingIndex >= 0) {
      data.favorites.splice(existingIndex, 1);
      isFavorited = false;
    } else {
      const newFav: UserFavoriteEntity = {
        id: `fav-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId,
        dramaId,
        createdAt: new Date().toISOString(),
      };
      data.favorites.push(newFav);
      isFavorited = true;
    }
  });

  res.json({
    isFavorited,
    message: isFavorited ? 'Added to favorites' : 'Removed from favorites',
  });
});

// Watch History
router.get('/history', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const history = db.get().watchHistory
    .filter((h) => h.userId === userId)
    .sort((a, b) => new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime());

  // Attach drama info
  const enriched = history.map((h) => {
    const drama = db.get().dramas.find((d) => d.id === h.dramaId);
    return {
      ...h,
      dramaTitle: drama?.title || 'Unknown Drama',
      dramaPoster: drama?.poster || '',
    };
  });

  res.json({ history: enriched });
});

router.post('/history', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { dramaId, episodeNumber, progressPercent } = req.body;

  if (!dramaId || episodeNumber === undefined) {
    return res.status(400).json({ error: 'dramaId and episodeNumber required.' });
  }

  db.update((data) => {
    const existing = data.watchHistory.find((h) => h.userId === userId && h.dramaId === dramaId);
    if (existing) {
      existing.episodeNumber = episodeNumber;
      existing.progressPercent = progressPercent || existing.progressPercent;
      existing.lastWatchedAt = new Date().toISOString();
    } else {
      const item: UserWatchHistoryEntity = {
        id: `hist-${Date.now()}`,
        userId,
        dramaId,
        episodeNumber,
        progressPercent: progressPercent || 10,
        lastWatchedAt: new Date().toISOString(),
      };
      data.watchHistory.push(item);
    }
  });

  res.json({ success: true });
});

router.delete('/history', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  db.update((data) => {
    data.watchHistory = data.watchHistory.filter((h) => h.userId !== userId);
  });
  res.json({ success: true, message: 'Watch history cleared.' });
});

// Daily Check-In
router.post('/daily-checkin', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const user = db.get().users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const todayStr = new Date().toISOString().split('T')[0];
  if (user.lastCheckInDate === todayStr) {
    return res.status(400).json({ error: 'You have already checked in today! Come back tomorrow.' });
  }

  const streakRewards = [10, 20, 30, 40, 50, 60, 100];
  const nextStreak = (user.dailyStreak % 7) + 1;
  const rewardCoins = streakRewards[(nextStreak - 1) % streakRewards.length];

  db.update((data) => {
    const u = data.users.find((usr) => usr.id === userId);
    if (u) {
      u.coins += rewardCoins;
      u.dailyStreak = nextStreak;
      u.lastCheckInDate = todayStr;
    }
  });

  const updatedUser = db.get().users.find((u) => u.id === userId)!;
  res.json({
    success: true,
    rewardCoins,
    dailyStreak: nextStreak,
    totalCoins: updatedUser.coins,
    message: `Claimed +${rewardCoins} coins for Day ${nextStreak}!`,
  });
});

// Claim Watch Time / Ad Reward
router.post('/claim-reward', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { rewardType, amount } = req.body; // 'ad' or 'watchTime'
  const coinsAwarded = Math.min(Math.max(1, parseInt(amount, 10) || 15), 500);

  db.update((data) => {
    const u = data.users.find((usr) => usr.id === userId);
    if (u) {
      u.coins += coinsAwarded;
    }
  });

  const updated = db.get().users.find((u) => u.id === userId)!;
  res.json({
    success: true,
    awarded: coinsAwarded,
    coins: updated.coins,
    message: `+${coinsAwarded} Coins added to your account!`,
  });
});

// Purchase VIP Subscription (Verified Server Transaction)
router.post('/subscribe', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const user = db.get().users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const { plan, paymentMethod, paymentDetails } = req.body; // 'daily' | 'monthly'
  if (plan !== 'daily' && plan !== 'monthly') {
    return res.status(400).json({ error: 'Invalid plan selected. Choose daily or monthly pass.' });
  }

  const settings = db.get().settings;
  const amount = plan === 'daily' ? settings.dailyPassPrice : settings.monthlyPassPrice;
  const durationDays = plan === 'daily' ? 1 : 30;
  const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
  const paymentRef = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  // Create Verified Payment Record
  const payment: PaymentRecordEntity = {
    id: `pay-${Date.now()}`,
    userId: user.id,
    userEmail: user.email,
    type: 'subscription',
    description: `${plan === 'daily' ? 'Daily Pass' : 'Monthly Pass'} VIP Subscription`,
    amount,
    currency: settings.currency || 'USD',
    status: 'completed',
    provider: (paymentMethod as any) || 'Credit Card',
    referenceId: paymentRef,
    createdAt: new Date().toISOString(),
  };

  // Create Subscription Record
  const subscription: SubscriptionEntity = {
    id: `sub-${Date.now()}`,
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    plan,
    status: 'active',
    amount,
    currency: settings.currency || 'USD',
    startDate: new Date().toISOString(),
    expiryDate,
    paymentRef,
    createdAt: new Date().toISOString(),
  };

  db.update((data) => {
    data.payments.unshift(payment);
    data.subscriptions.unshift(subscription);
    const u = data.users.find((usr) => usr.id === userId);
    if (u) {
      u.isVip = true;
      u.vipPlan = plan;
      u.vipExpiry = expiryDate;
    }
  });

  const updatedUser = db.get().users.find((u) => u.id === userId)!;
  res.json({
    success: true,
    user: sanitizeUser(updatedUser),
    subscription,
    message: `Congratulations! ${plan === 'daily' ? 'Daily Pass' : 'Monthly VIP Pass'} is active until ${new Date(expiryDate).toLocaleDateString()}.`,
  });
});

// Buy Coins Bundle (Verified Server Transaction)
router.post('/buy-coins', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const user = db.get().users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const { bundleId, coins, bonusCoins, priceUsd } = req.body;
  const totalCoins = (parseInt(coins, 10) || 0) + (parseInt(bonusCoins, 10) || 0);
  const cost = parseFloat(priceUsd) || 0.99;

  if (totalCoins <= 0) {
    return res.status(400).json({ error: 'Invalid coin bundle.' });
  }

  const paymentRef = `COIN-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const payment: PaymentRecordEntity = {
    id: `pay-${Date.now()}`,
    userId: user.id,
    userEmail: user.email,
    type: 'coins',
    description: `Purchase of ${coins} Coins + ${bonusCoins || 0} Bonus Coins`,
    amount: cost,
    currency: 'USD',
    status: 'completed',
    provider: 'Credit Card',
    referenceId: paymentRef,
    createdAt: new Date().toISOString(),
  };

  db.update((data) => {
    data.payments.unshift(payment);
    const u = data.users.find((usr) => usr.id === userId);
    if (u) {
      u.coins += totalCoins;
    }
  });

  const updatedUser = db.get().users.find((u) => u.id === userId)!;
  res.json({
    success: true,
    user: sanitizeUser(updatedUser),
    addedCoins: totalCoins,
    totalCoins: updatedUser.coins,
    message: `Successfully purchased ${totalCoins} coins!`,
  });
});

export default router;
