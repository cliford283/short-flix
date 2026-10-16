import { Router, Response } from 'express';
import { db, DramaEntity, EpisodeEntity } from '../db';
import { AuthenticatedRequest, requireAdmin, requireAuth } from '../auth';

const router = Router();

// Public: Get all dramas (filtered by published unless admin requested)
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const { category, genre, search, all } = req.query;
  const isReqAdmin = req.user?.role === 'admin' && all === 'true';

  let list = db.get().dramas;

  if (!isReqAdmin) {
    list = list.filter((d) => d.isPublished);
  }

  if (category && typeof category === 'string' && category !== 'All') {
    list = list.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  }

  if (genre && typeof genre === 'string' && genre !== 'All') {
    list = list.filter((d) =>
      d.genres.some((g) => g.toLowerCase() === genre.toLowerCase()) ||
      d.category.toLowerCase().includes(genre.toLowerCase())
    );
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.subtitle.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.director?.toLowerCase().includes(q) ||
        d.cast?.some((c) => c.toLowerCase().includes(q))
    );
  }

  // Attach episode counts, free episode counts, and episodes list
  const episodes = db.get().episodes;
  const enriched = list.map((drama) => {
    const dramaEpisodes = episodes
      .filter((ep) => ep.dramaId === drama.id && (isReqAdmin || ep.isPublished))
      .sort((a, b) => a.number - b.number);
    return {
      ...drama,
      totalEpisodes: dramaEpisodes.length,
      freeEpisodesCount: dramaEpisodes.filter((ep) => ep.isFree).length,
      episodes: dramaEpisodes,
    };
  });

  res.json({ dramas: enriched });
});

// Public: Get single drama by ID
router.get('/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const drama = db.get().dramas.find((d) => d.id === id);

  if (!drama) {
    return res.status(404).json({ error: 'Drama series not found.' });
  }

  const isReqAdmin = req.user?.role === 'admin';
  if (!drama.isPublished && !isReqAdmin) {
    return res.status(403).json({ error: 'This drama is not published.' });
  }

  const episodes = db.get().episodes.filter(
    (ep) => ep.dramaId === drama.id && (isReqAdmin || ep.isPublished)
  );

  res.json({
    drama: {
      ...drama,
      totalEpisodes: episodes.length,
      freeEpisodesCount: episodes.filter((ep) => ep.isFree).length,
      episodes: episodes.sort((a, b) => a.number - b.number),
    },
  });
});

// Public/User: Get episodes for a drama with access verification
router.get('/:id/episodes', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const drama = db.get().dramas.find((d) => d.id === id);
  if (!drama) {
    return res.status(404).json({ error: 'Drama series not found.' });
  }

  const isReqAdmin = req.user?.role === 'admin';
  const isVipUser = req.user?.isVip || req.user?.role === 'admin';

  let episodes = db.get().episodes.filter(
    (ep) => ep.dramaId === drama.id && (isReqAdmin || ep.isPublished)
  );

  episodes = episodes.sort((a, b) => a.number - b.number);

  // Map unlocked state for each episode
  const mapped = episodes.map((ep) => {
    const isUnlocked = ep.isFree || isVipUser;
    return {
      ...ep,
      isUnlocked,
      // Protected video URL: for restricted episodes, only expose video URL if authorized
      videoUrl: isUnlocked ? ep.videoUrl : '',
    };
  });

  res.json({ episodes: mapped });
});

// User: Unlock episode using coins (Server-Side Authorization & Coin Deduction)
router.post('/:id/episodes/:num/unlock', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id, num } = req.params;
  const epNum = parseInt(num, 10);
  const user = req.user!;

  const drama = db.get().dramas.find((d) => d.id === id);
  if (!drama) return res.status(404).json({ error: 'Drama not found.' });

  const episode = db.get().episodes.find((ep) => ep.dramaId === id && ep.number === epNum);
  if (!episode) return res.status(404).json({ error: 'Episode not found.' });

  if (episode.isFree || user.isVip || user.role === 'admin') {
    return res.json({ success: true, message: 'Episode is already accessible.', videoUrl: episode.videoUrl });
  }

  const cost = episode.coinPrice || 28;
  if (user.coins < cost) {
    return res.status(400).json({
      error: `Insufficient coins. You have ${user.coins} coins, but ${cost} are required.`,
      requiredCoins: cost,
      userCoins: user.coins,
    });
  }

  // Deduct coins atomically
  db.update((data) => {
    const u = data.users.find((usr) => usr.id === user.id);
    if (u) {
      u.coins -= cost;
    }
  });

  res.json({
    success: true,
    message: `Episode ${episode.number} successfully unlocked.`,
    remainingCoins: user.coins - cost,
    videoUrl: episode.videoUrl,
  });
});

// ==========================================
// ADMIN DASHBOARD DRAMA MANAGEMENT ENDPOINTS
// ==========================================

// Admin: Create new drama
router.post('/admin/dramas', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const {
    id,
    title,
    subtitle,
    description,
    category,
    genres,
    tags,
    poster,
    backdrop,
    director,
    cast,
    releaseDate,
    rating,
    isFeatured,
    isRecentlyAdded,
    isPublished,
  } = req.body;

  if (!title || !category) {
    return res.status(400).json({ error: 'Title and category are required.' });
  }

  const dramaId = (id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();

  const existing = db.get().dramas.find((d) => d.id === dramaId);
  if (existing) {
    return res.status(400).json({ error: 'A drama with this identifier already exists.' });
  }

  const newDrama: DramaEntity = {
    id: dramaId,
    title: title.trim(),
    subtitle: subtitle?.trim() || '',
    description: description?.trim() || '',
    category: category || 'Action',
    genres: Array.isArray(genres) ? genres : ['Action'],
    tags: Array.isArray(tags) ? tags : ['Drama'],
    poster: poster || '/src/assets/images/poster_vagabond_action_1792132925240.jpg',
    backdrop: backdrop || poster || '/src/assets/images/poster_vagabond_action_1792132925240.jpg',
    director: director || 'Director',
    cast: Array.isArray(cast) ? cast : ['Cast Members'],
    releaseDate: releaseDate || new Date().toISOString().split('T')[0],
    rating: parseFloat(rating) || 9.5,
    views: '1.2K',
    isFeatured: Boolean(isFeatured),
    isRecentlyAdded: isRecentlyAdded !== undefined ? Boolean(isRecentlyAdded) : true,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.update((data) => {
    data.dramas.unshift(newDrama);
  });

  res.status(201).json({ drama: newDrama, message: 'Drama created successfully.' });
});

// Admin: Update drama
router.put('/admin/dramas/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const drama = db.get().dramas.find((d) => d.id === id);

  if (!drama) {
    return res.status(404).json({ error: 'Drama not found.' });
  }

  db.update((data) => {
    const target = data.dramas.find((d) => d.id === id);
    if (target) {
      Object.assign(target, req.body, {
        id, // ensure ID is immutable
        updatedAt: new Date().toISOString(),
      });
    }
  });

  const updated = db.get().dramas.find((d) => d.id === id);
  res.json({ drama: updated, message: 'Drama updated successfully.' });
});

// Admin: Delete drama & its episodes
router.delete('/admin/dramas/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  db.update((data) => {
    data.dramas = data.dramas.filter((d) => d.id !== id);
    data.episodes = data.episodes.filter((ep) => ep.dramaId !== id);
    data.favorites = data.favorites.filter((f) => f.dramaId !== id);
    data.watchHistory = data.watchHistory.filter((h) => h.dramaId !== id);
    data.comments = data.comments.filter((c) => c.dramaId !== id);
  });

  res.json({ success: true, message: 'Drama and all associated episodes deleted successfully.' });
});

// Admin: Add episode to drama
router.post('/admin/dramas/:id/episodes', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const drama = db.get().dramas.find((d) => d.id === id);
  if (!drama) return res.status(404).json({ error: 'Drama not found.' });

  const { title, synopsis, duration, videoUrl, thumbnail, isFree, coinPrice, isPublished, number } = req.body;

  const currentEpisodes = db.get().episodes.filter((ep) => ep.dramaId === id);
  const nextNum = number ? parseInt(number, 10) : currentEpisodes.length + 1;

  const newEp: EpisodeEntity = {
    id: `${id}-ep-${nextNum}-${Date.now()}`,
    dramaId: id,
    number: nextNum,
    title: title?.trim() || `Episode ${nextNum}`,
    synopsis: synopsis?.trim() || `Episode ${nextNum} of ${drama.title}`,
    duration: duration?.trim() || '1:45',
    videoUrl: videoUrl?.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: thumbnail || drama.poster,
    isFree: isFree !== undefined ? Boolean(isFree) : nextNum <= 9,
    coinPrice: isFree ? 0 : (parseInt(coinPrice, 10) || 28),
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    views: 0,
    createdAt: new Date().toISOString(),
  };

  db.update((data) => {
    data.episodes.push(newEp);
  });

  res.status(201).json({ episode: newEp, message: 'Episode added successfully.' });
});

// Admin: Update episode
router.put('/admin/episodes/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const ep = db.get().episodes.find((e) => e.id === id);
  if (!ep) return res.status(404).json({ error: 'Episode not found.' });

  db.update((data) => {
    const target = data.episodes.find((e) => e.id === id);
    if (target) {
      Object.assign(target, req.body, { id: target.id, dramaId: target.dramaId });
    }
  });

  const updated = db.get().episodes.find((e) => e.id === id);
  res.json({ episode: updated, message: 'Episode updated successfully.' });
});

// Admin: Delete episode
router.delete('/admin/episodes/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  db.update((data) => {
    data.episodes = data.episodes.filter((e) => e.id !== id);
  });
  res.json({ success: true, message: 'Episode deleted successfully.' });
});

// Admin: Reorder episodes
router.post('/admin/episodes/reorder', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { orderedEpisodeIds } = req.body;
  if (!Array.isArray(orderedEpisodeIds)) {
    return res.status(400).json({ error: 'orderedEpisodeIds must be an array of IDs.' });
  }

  db.update((data) => {
    orderedEpisodeIds.forEach((epId, index) => {
      const ep = data.episodes.find((e) => e.id === epId);
      if (ep) {
        ep.number = index + 1;
      }
    });
  });

  res.json({ success: true, message: 'Episodes reordered successfully.' });
});

export default router;
