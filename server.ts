import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';

import { authenticate } from './server/auth';
import authRouter from './server/routes/auth';
import dramasRouter from './server/routes/dramas';
import adminRouter from './server/routes/admin';
import userRouter from './server/routes/user';
import commentsRouter from './server/routes/comments';
import notificationsRouter from './server/routes/notifications';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  // Global user authentication middleware attaches req.user if token present
  app.use(authenticate);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'ShortFlix Backend API', time: new Date().toISOString() });
  });

  // Mount API endpoints
  app.use('/api/auth', authRouter);
  app.use('/api/dramas', dramasRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/user', userRouter);
  app.use('/api/comments', commentsRouter);
  app.use('/api/notifications', notificationsRouter);

  // Vite integration
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ShortFlix Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
