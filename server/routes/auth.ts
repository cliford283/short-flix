import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, UserEntity } from '../db';
import { generateToken, sanitizeUser, AuthenticatedRequest, requireAuth } from '../auth';

const router = Router();

// Register new user
router.post('/register', (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = db.get().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser: UserEntity = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    role: 'user', // strictly enforced: users can never self-assign admin role!
    coins: 100, // Welcome bonus
    isVip: false,
    vipPlan: 'none',
    dailyStreak: 1,
    watchTimeMinutes: 0,
    claimedWatchTimeRewards: [],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  };

  db.update((data) => {
    data.users.push(newUser);
  });

  const token = generateToken(newUser);
  res.json({
    token,
    user: sanitizeUser(newUser),
    message: 'Account created successfully.',
  });
});

// Login
router.post('/login', (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.get().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.disabled) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = generateToken(user);
  res.json({
    token,
    user: sanitizeUser(user),
  });
});

// Admin Login
router.post('/admin-login', (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Admin email and password are required.' });
  }

  const user = db.get().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.role !== 'admin' || user.disabled) {
    return res.status(403).json({ error: 'Access denied: Valid administrator credentials required.' });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(403).json({ error: 'Invalid administrator credentials.' });
  }

  const token = generateToken(user);
  res.json({
    token,
    user: sanitizeUser(user),
  });
});

// Current User Profile
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  res.json({ user: sanitizeUser(req.user) });
});

export default router;
