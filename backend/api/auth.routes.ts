import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, query, get, run } from '../../database/db.js';
import { signToken } from '../utils/jwt.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../schemas/auth.schema.js';
import { logger } from '../utils/logger.js';

export const authRouter = Router();

// POST /api/v1/auth/register
authRouter.post('/register', validateBody(registerSchema), async (req: Request, res: Response) => {
  const { username, email, password, displayName, department, year, role } = req.body;

  // Institutional email enforcement check (if enabled in .env)
  if (process.env.ENABLE_INSTITUTIONAL_EMAIL_RESTRICTION === 'true') {
    if (!email.toLowerCase().endsWith('@sethu.ac.in')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INSTITUTIONAL_EMAIL_REQUIRED',
          message: 'Registration is restricted to official Sethu Institute of Technology emails (@sethu.ac.in).'
        }
      });
    }
  }

  // Check unique username and email
  const existing = get<any>('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
  if (existing) {
    return res.status(409).json({
      success: false,
      error: {
        code: 'USER_EXISTS',
        message: 'A user with that username or email address already exists.'
      }
    });
  }

  const userId = `u-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const passwordHash = bcrypt.hashSync(password, 10);
  const userRole = role || 'student';

  try {
    run(`
      INSERT INTO users (id, username, email, password_hash, role, is_verified, reputation)
      VALUES (?, ?, ?, ?, ?, 1, 50)
    `, [userId, username, email, passwordHash, userRole]);

    run(`
      INSERT INTO profiles (user_id, display_name, avatar_url, bio, department, year, skills, interests)
      VALUES (?, ?, ?, ?, ?, ?, '[]', '[]')
    `, [
      userId,
      displayName,
      `https://api.dicebear.com/7.x/bottts/svg?seed=${username}&backgroundColor=0f172a,1e1b4b`,
      `${department} ${year ? 'Year ' + year : ''} student at Sethu Institute of Technology.`,
      department,
      year || 1
    ]);

    // Automatically join /c/general
    run('INSERT OR IGNORE INTO community_members (community_id, user_id, role) VALUES (?, ?, ?)', ['c-general', userId, 'member']);

    logger.security('User Registered', { userId, username, role: userRole });

    const token = signToken({ userId, username, role: userRole });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: userId,
          username,
          email,
          role: userRole,
          displayName,
          department,
          year: year || 1,
          reputation: 50,
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}&backgroundColor=0f172a,1e1b4b`
        }
      }
    });
  } catch (err) {
    logger.error('Registration failed:', err);
    res.status(500).json({
      success: false,
      error: { code: 'REGISTRATION_FAILED', message: 'Failed to create account.' }
    });
  }
});

// POST /api/v1/auth/login
authRouter.post('/login', validateBody(loginSchema), async (req: Request, res: Response) => {
  const { login, password } = req.body;

  const user = get<any>(`
    SELECT u.*, pr.display_name, pr.avatar_url, pr.department, pr.year, pr.skills, pr.interests
    FROM users u
    LEFT JOIN profiles pr ON u.id = pr.user_id
    WHERE u.username = ? OR u.email = ?
  `, [login, login]);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect username/email or password.' }
    });
  }

  logger.security('User Logged In', { userId: user.id, username: user.username });

  const token = signToken({ userId: user.id, username: user.username, role: user.role });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        displayName: user.display_name,
        avatarUrl: user.avatar_url,
        department: user.department,
        year: user.year,
        reputation: user.reputation,
        skills: JSON.parse(user.skills || '[]'),
        interests: JSON.parse(user.interests || '[]')
      }
    }
  });
});

// POST /api/v1/auth/demo-switch (One-click login as Demo Student, Faculty, Moderator, or Admin)
authRouter.post('/demo-switch', async (req: Request, res: Response) => {
  const { role } = req.body;

  let targetUsername = 'karthik_csd'; // default student
  if (role === 'faculty') targetUsername = 'dr_ramanathan';
  else if (role === 'moderator') targetUsername = 'priya_mod';
  else if (role === 'admin') targetUsername = 'admin_sethu';

  const user = get<any>(`
    SELECT u.*, pr.display_name, pr.avatar_url, pr.department, pr.year, pr.skills, pr.interests
    FROM users u
    LEFT JOIN profiles pr ON u.id = pr.user_id
    WHERE u.username = ?
  `, [targetUsername]);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: { code: 'DEMO_USER_NOT_FOUND', message: 'Demo account not initialized. Please run seed.' }
    });
  }

  const token = signToken({ userId: user.id, username: user.username, role: user.role });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        displayName: user.display_name,
        avatarUrl: user.avatar_url,
        department: user.department,
        year: user.year,
        reputation: user.reputation,
        skills: JSON.parse(user.skills || '[]'),
        interests: JSON.parse(user.interests || '[]')
      }
    }
  });
});

// GET /api/v1/auth/me
authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;

  const user = get<any>(`
    SELECT u.id, u.username, u.email, u.role, u.is_verified, u.reputation,
           pr.display_name, pr.avatar_url, pr.bio, pr.department, pr.year, pr.skills, pr.interests
    FROM users u
    LEFT JOIN profiles pr ON u.id = pr.user_id
    WHERE u.id = ?
  `, [userId]);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User not found.' }
    });
  }

  // Get user badges
  const userBadges = query<any>(`
    SELECT b.slug, b.name, b.description, b.icon, b.category
    FROM user_badges ub
    JOIN badges b ON ub.badge_slug = b.slug
    WHERE ub.user_id = ?
  `, [userId]);

  res.json({
    success: true,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      reputation: user.reputation,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      department: user.department,
      year: user.year,
      skills: JSON.parse(user.skills || '[]'),
      interests: JSON.parse(user.interests || '[]'),
      badges: userBadges
    }
  });
});

// PUT /api/v1/auth/profile
authRouter.put('/profile', requireAuth, validateBody(updateProfileSchema), async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { displayName, bio, department, year, skills, interests } = req.body;

  const updates: string[] = [];
  const params: any[] = [];

  if (displayName !== undefined) { updates.push('display_name = ?'); params.push(displayName); }
  if (bio !== undefined) { updates.push('bio = ?'); params.push(bio); }
  if (department !== undefined) { updates.push('department = ?'); params.push(department); }
  if (year !== undefined) { updates.push('year = ?'); params.push(year); }
  if (skills !== undefined) { updates.push('skills = ?'); params.push(JSON.stringify(skills)); }
  if (interests !== undefined) { updates.push('interests = ?'); params.push(JSON.stringify(interests)); }

  if (updates.length > 0) {
    params.push(userId);
    run(`UPDATE profiles SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`, params);
  }

  res.json({
    success: true,
    data: { message: 'Profile successfully updated.' }
  });
});

