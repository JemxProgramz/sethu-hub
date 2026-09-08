import { Router, Response } from 'express';
import { query, get } from '../../database/db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';

export const usersRouter = Router();

// GET /api/v1/users/:username (Public Profile)
usersRouter.get('/:username', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const username = req.params.username;

  const user = get<any>(`
    SELECT u.id, u.username, u.role, u.reputation, u.created_at,
           pr.display_name, pr.avatar_url, pr.bio, pr.department, pr.year,
           pr.skills, pr.interests, pr.is_private
    FROM users u
    LEFT JOIN profiles pr ON u.id = pr.user_id
    WHERE u.username = ?
  `, [username]);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User profile not found.' }
    });
  }

  // Badges
  const badges = query<any>(`
    SELECT b.slug, b.name, b.description, b.icon, b.category
    FROM user_badges ub
    JOIN badges b ON ub.badge_slug = b.slug
    WHERE ub.user_id = ?
  `, [user.id]);

  // Joined Communities
  const joinedCommunities = query<any>(`
    SELECT c.slug, c.name, c.icon_url
    FROM community_members cm
    JOIN communities c ON cm.community_id = c.id
    WHERE cm.user_id = ?
  `, [user.id]);

  // Recent Posts
  const recentPosts = query<any>(`
    SELECT p.id, p.title, p.post_type, p.upvotes_count, p.comments_count, p.created_at, c.slug as community_slug
    FROM posts p
    JOIN communities c ON p.community_id = c.id
    WHERE p.author_id = ? AND p.is_deleted = 0
    ORDER BY p.created_at DESC
    LIMIT 10
  `, [user.id]);

  res.json({
    success: true,
    data: {
      profile: {
        id: user.id,
        username: user.username,
        role: user.role,
        reputation: user.reputation,
        displayName: user.display_name,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        department: user.department,
        year: user.year,
        skills: JSON.parse(user.skills || '[]'),
        interests: JSON.parse(user.interests || '[]'),
        badges,
        joinedCommunities,
        recentPosts
      }
    }
  });
});

// GET /api/v1/users/:username/saved
usersRouter.get('/:username/saved', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user!.userId;
  const username = req.params.username;

  const user = get<any>('SELECT id FROM users WHERE username = ?', [username]);
  if (!user || (user.id !== currentUserId && req.user!.role !== 'admin')) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'You can only view your own saved posts.' }
    });
  }

  const savedPosts = query<any>(`
    SELECT p.id, p.title, p.content, p.post_type, p.upvotes_count, p.comments_count, p.created_at,
           c.slug as community_slug, c.name as community_name,
           u.username as author_username, pr.display_name as author_display_name, pr.avatar_url as author_avatar
    FROM saves s
    JOIN posts p ON s.post_id = p.id
    JOIN communities c ON p.community_id = c.id
    JOIN users u ON p.author_id = u.id
    LEFT JOIN profiles pr ON u.id = pr.user_id
    WHERE s.user_id = ? AND p.is_deleted = 0
    ORDER BY s.created_at DESC
  `, [user.id]);

  res.json({
    success: true,
    data: { savedPosts }
  });
});

