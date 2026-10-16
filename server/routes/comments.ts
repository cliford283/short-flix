import { Router, Response } from 'express';
import { db, CommentEntity } from '../db';
import { AuthenticatedRequest, requireAuth } from '../auth';

const router = Router();

// Public: Get comments for a drama
router.get('/:dramaId', (req: AuthenticatedRequest, res: Response) => {
  const { dramaId } = req.params;
  const { episodeNumber } = req.query;

  let comments = db.get().comments.filter((c) => c.dramaId === dramaId && c.isApproved);

  if (episodeNumber) {
    const epNum = parseInt(episodeNumber as string, 10);
    if (!isNaN(epNum)) {
      comments = comments.filter((c) => c.episodeNumber === epNum);
    }
  }

  res.json({
    comments: comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  });
});

// Authenticated: Post a comment
router.post('/:dramaId', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { dramaId } = req.params;
  const { content, episodeNumber } = req.body;
  const user = req.user!;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Comment text cannot be empty.' });
  }

  const newComment: CommentEntity = {
    id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    dramaId,
    episodeNumber: parseInt(episodeNumber, 10) || 1,
    userId: user.id,
    author: user.name,
    avatar: user.avatar,
    content: content.trim(),
    likes: 0,
    isApproved: true, // auto-approve by default, administrators can moderate or flag
    isFlagged: false,
    createdAt: new Date().toISOString(),
  };

  db.update((data) => {
    data.comments.unshift(newComment);
  });

  res.status(201).json({ comment: newComment, message: 'Comment posted.' });
});

// Authenticated: Like a comment
router.post('/:id/like', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  let newLikes = 0;

  db.update((data) => {
    const c = data.comments.find((item) => item.id === id);
    if (c) {
      c.likes += 1;
      newLikes = c.likes;
    }
  });

  res.json({ success: true, likes: newLikes });
});

export default router;
