import { Router, Response } from 'express';
import { db, CategoryEntity, NotificationEntity, PlatformSettingsEntity } from '../db';
import { AuthenticatedRequest, requireAdmin, sanitizeUser } from '../auth';

const router = Router();

// Protect all admin routes
router.use(requireAdmin);

// 1. Overview Dashboard Stats
router.get('/stats', (req: AuthenticatedRequest, res: Response) => {
  const data = db.get();
  const totalUsers = data.users.length;
  const totalDramas = data.dramas.length;
  const totalEpisodes = data.episodes.length;
  const publishedDramas = data.dramas.filter((d) => d.isPublished).length;
  const publishedEpisodes = data.episodes.filter((e) => e.isPublished).length;
  const activeSubscriptions = data.subscriptions.filter((s) => s.status === 'active').length;
  const totalRevenue = data.payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingComments = data.comments.filter((c) => !c.isApproved || c.isFlagged).length;

  const recentPayments = [...data.payments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const topDramas = [...data.dramas]
    .sort((a, b) => (b.trendingRank || 99) - (a.trendingRank || 99))
    .slice(0, 4)
    .map((d) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      views: d.views,
      rating: d.rating,
      episodesCount: data.episodes.filter((e) => e.dramaId === d.id).length,
    }));

  res.json({
    stats: {
      totalUsers,
      totalDramas,
      publishedDramas,
      totalEpisodes,
      publishedEpisodes,
      activeSubscriptions,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      pendingComments,
    },
    recentPayments,
    topDramas,
  });
});

// 2. User Management
router.get('/users', (req: AuthenticatedRequest, res: Response) => {
  const { search, role, status } = req.query;
  let users = db.get().users.map(sanitizeUser);

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    users = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  if (role && typeof role === 'string' && role !== 'all') {
    users = users.filter((u) => u.role === role);
  }

  if (status && typeof status === 'string' && status !== 'all') {
    if (status === 'active') users = users.filter((u) => !u.disabled);
    if (status === 'disabled') users = users.filter((u) => u.disabled);
    if (status === 'vip') users = users.filter((u) => u.isVip);
  }

  res.json({ users });
});

router.put('/users/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { role, coins, isVip, vipPlan, disabled, name } = req.body;

  const target = db.get().users.find((u) => u.id === id);
  if (!target) return res.status(404).json({ error: 'User not found.' });

  // Prevent self-demotion or disabling own admin account
  if (req.user?.id === id && (role === 'user' || disabled === true)) {
    return res.status(400).json({ error: 'You cannot demote or disable your own active admin account.' });
  }

  db.update((data) => {
    const u = data.users.find((usr) => usr.id === id);
    if (u) {
      if (role !== undefined) u.role = role;
      if (coins !== undefined) u.coins = Math.max(0, parseInt(coins, 10) || 0);
      if (isVip !== undefined) {
        u.isVip = Boolean(isVip);
        if (u.isVip) {
          u.vipPlan = vipPlan || 'monthly';
          u.vipExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        } else {
          u.vipPlan = 'none';
          u.vipExpiry = undefined;
        }
      }
      if (disabled !== undefined) u.disabled = Boolean(disabled);
      if (name !== undefined && name.trim()) u.name = name.trim();
    }
  });

  const updated = db.get().users.find((u) => u.id === id);
  res.json({ user: sanitizeUser(updated!), message: 'User updated successfully.' });
});

router.delete('/users/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  if (req.user?.id === id) {
    return res.status(400).json({ error: 'You cannot delete your own admin account.' });
  }

  db.update((data) => {
    data.users = data.users.filter((u) => u.id !== id);
    data.favorites = data.favorites.filter((f) => f.userId !== id);
    data.watchHistory = data.watchHistory.filter((h) => h.userId !== id);
  });

  res.json({ success: true, message: 'User account removed.' });
});

// 3. Category & Genre Management
router.get('/categories', (req: AuthenticatedRequest, res: Response) => {
  const categories = db.get().categories;
  res.json({ categories });
});

router.post('/categories', (req: AuthenticatedRequest, res: Response) => {
  const { name, description } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required.' });
  }

  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const existing = db.get().categories.find((c) => c.slug === slug);
  if (existing) {
    return res.status(400).json({ error: 'Category with this name already exists.' });
  }

  const newCat: CategoryEntity = {
    id: `cat-${Date.now()}`,
    name: name.trim(),
    slug,
    description: description?.trim() || '',
  };

  db.update((data) => {
    data.categories.push(newCat);
  });

  res.status(201).json({ category: newCat, message: 'Category created successfully.' });
});

router.put('/categories/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  db.update((data) => {
    const cat = data.categories.find((c) => c.id === id);
    if (cat) {
      if (name) {
        cat.name = name.trim();
        cat.slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      if (description !== undefined) cat.description = description.trim();
    }
  });

  const updated = db.get().categories.find((c) => c.id === id);
  res.json({ category: updated, message: 'Category updated.' });
});

router.delete('/categories/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  db.update((data) => {
    data.categories = data.categories.filter((c) => c.id !== id);
  });
  res.json({ success: true, message: 'Category deleted.' });
});

// 4. Subscriptions Management
router.get('/subscriptions', (req: AuthenticatedRequest, res: Response) => {
  const { status, plan } = req.query;
  let subs = db.get().subscriptions;

  if (status && typeof status === 'string' && status !== 'all') {
    subs = subs.filter((s) => s.status === status);
  }
  if (plan && typeof plan === 'string' && plan !== 'all') {
    subs = subs.filter((s) => s.plan === plan);
  }

  res.json({
    subscriptions: subs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  });
});

router.post('/subscriptions/grant', (req: AuthenticatedRequest, res: Response) => {
  const { userId, plan, durationDays } = req.body;
  const user = db.get().users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const days = parseInt(durationDays, 10) || (plan === 'daily' ? 1 : 30);
  const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  const sub = {
    id: `sub-grant-${Date.now()}`,
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    plan: plan || 'monthly',
    status: 'active' as const,
    amount: 0,
    currency: 'USD',
    startDate: new Date().toISOString(),
    expiryDate,
    paymentRef: `ADMIN-GRANT-${req.user?.id}`,
    createdAt: new Date().toISOString(),
  };

  db.update((data) => {
    data.subscriptions.unshift(sub);
    const u = data.users.find((usr) => usr.id === userId);
    if (u) {
      u.isVip = true;
      u.vipPlan = plan || 'monthly';
      u.vipExpiry = expiryDate;
    }
  });

  res.json({ success: true, message: `VIP access granted to ${user.name} for ${days} days.` });
});

router.put('/subscriptions/:id/cancel', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  let targetUserId = '';

  db.update((data) => {
    const sub = data.subscriptions.find((s) => s.id === id);
    if (sub) {
      sub.status = 'cancelled';
      targetUserId = sub.userId;
      const u = data.users.find((usr) => usr.id === sub.userId);
      if (u) {
        u.isVip = false;
        u.vipPlan = 'none';
        u.vipExpiry = undefined;
      }
    }
  });

  res.json({ success: true, message: 'Subscription cancelled.' });
});

// 5. Payments Management
router.get('/payments', (req: AuthenticatedRequest, res: Response) => {
  const { type, status } = req.query;
  let payments = db.get().payments;

  if (type && typeof type === 'string' && type !== 'all') {
    payments = payments.filter((p) => p.type === type);
  }
  if (status && typeof status === 'string' && status !== 'all') {
    payments = payments.filter((p) => p.status === status);
  }

  res.json({
    payments: payments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  });
});

// 6. Comments Moderation
router.get('/comments', (req: AuthenticatedRequest, res: Response) => {
  const { flaggedOnly } = req.query;
  let comments = db.get().comments;

  if (flaggedOnly === 'true') {
    comments = comments.filter((c) => c.isFlagged || !c.isApproved);
  }

  res.json({
    comments: comments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  });
});

router.put('/comments/:id/moderate', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { isApproved, isFlagged } = req.body;

  db.update((data) => {
    const c = data.comments.find((item) => item.id === id);
    if (c) {
      if (isApproved !== undefined) c.isApproved = Boolean(isApproved);
      if (isFlagged !== undefined) c.isFlagged = Boolean(isFlagged);
    }
  });

  res.json({ success: true, message: 'Comment moderation state updated.' });
});

router.delete('/comments/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  db.update((data) => {
    data.comments = data.comments.filter((c) => c.id !== id);
  });
  res.json({ success: true, message: 'Comment deleted.' });
});

// 7. Notifications & Announcements
router.get('/notifications', (req: AuthenticatedRequest, res: Response) => {
  const notifs = db.get().notifications;
  res.json({
    notifications: notifs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  });
});

router.post('/notifications', (req: AuthenticatedRequest, res: Response) => {
  const { title, message, type, dramaId } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are required.' });
  }

  const newNotif: NotificationEntity = {
    id: `notif-${Date.now()}`,
    title: title.trim(),
    message: message.trim(),
    type: type || 'announcement',
    targetUserId: 'all',
    dramaId: dramaId || undefined,
    createdAt: new Date().toISOString(),
  };

  db.update((data) => {
    data.notifications.unshift(newNotif);
  });

  res.status(201).json({ notification: newNotif, message: 'Notification broadcasted successfully.' });
});

router.delete('/notifications/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  db.update((data) => {
    data.notifications = data.notifications.filter((n) => n.id !== id);
  });
  res.json({ success: true, message: 'Notification removed.' });
});

// 8. Platform Settings
router.get('/settings', (req: AuthenticatedRequest, res: Response) => {
  const settings = db.get().settings;
  res.json({ settings });
});

router.put('/settings', (req: AuthenticatedRequest, res: Response) => {
  const updates: Partial<PlatformSettingsEntity> = req.body;

  db.update((data) => {
    data.settings = {
      ...data.settings,
      ...updates,
    };
  });

  res.json({ settings: db.get().settings, message: 'Platform settings saved.' });
});

export default router;
