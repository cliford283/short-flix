import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db, UserEntity } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'shortflix-platform-secure-jwt-secret-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: UserEntity;
}

export function generateToken(user: UserEntity): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function sanitizeUser(user: UserEntity) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : req.cookies?.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    const user = db.get().users.find((u) => u.id === decoded.id);
    if (user && !user.disabled) {
      req.user = user;
    }
  } catch (err) {
    // Token expired or invalid
  }
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Administrator privileges required.' });
  }
  next();
}
