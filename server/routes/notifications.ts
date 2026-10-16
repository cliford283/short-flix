import { Router, Response } from 'express';
import { db } from '../db';
import { AuthenticatedRequest } from '../auth';

const router = Router();

// Public/User: Get announcements and notifications
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const notifications = db.get().notifications.filter(
    (n) => n.targetUserId === 'all' || (userId && n.targetUserId === userId)
  );

  const settings = db.get().settings;

  res.json({
    notifications: notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    announcement: settings.announcementActive
      ? {
          active: true,
          text: settings.announcementText,
        }
      : null,
  });
});

export default router;
