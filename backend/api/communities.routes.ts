import { Router, Response } from 'express';
import { query, get, run, transaction } from '../../database/db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { Community } from '../models/types.js';

export const communitiesRouter = Router();

// GET /api/v1/communities
communitiesRouter.get('/', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user?.userId;

  const rawComms = query<any>(`
    SELECT c.*,
      (SELECT COUNT(*) FROM posts p WHERE p.community_id = c.id AND p.is_deleted = 0) as post_count
    FROM communities c
    ORDER BY c.is_official DESC, c.member_count DESC
  `);

  const communities: Community[] = rawComms.map(c => {
    let isMember = false;
    if (currentUserId) {
      const membership = get<any>('SELECT 1 FROM community_members WHERE community_id = ? AND user_id = ?', [c.id, currentUserId]);
      if (membership) isMember = true;
    }

    return {
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      icon_url: c.icon_url,
      banner_url: c.banner_url,
      rules: JSON.parse(c.rules || '[]'),
      member_count: c.member_count,
      is_official: c.is_official,
      created_by: c.created_by,
      created_at: c.created_at,
      is_member: isMember
    };
  });

  res.json({
    success: true,
    data: { communities }
  });
});

// GET /api/v1/communities/:slug
communitiesRouter.get('/:slug', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user?.userId;
  const slug = req.params.slug;

  const c = get<any>('SELECT * FROM communities WHERE slug = ?', [slug]);
  if (!c) {
    return res.status(404).json({
      success: false,
      error: { code: 'COMMUNITY_NOT_FOUND', message: 'Community not found.' }
    });
  }

  let isMember = false;
  let userRoleInCommunity = null;

  if (currentUserId) {
    const mem = get<any>('SELECT role FROM community_members WHERE community_id = ? AND user_id = ?', [c.id, currentUserId]);
    if (mem) {
      isMember = true;
      userRoleInCommunity = mem.role;
    }
  }

  // Retrieve moderators
  const moderators = query<any>(`
    SELECT u.username, pr.display_name, pr.avatar_url
    FROM community_members cm
    JOIN users u ON cm.user_id = u.id
    LEFT JOIN profiles pr ON u.id = pr.user_id
    WHERE cm.community_id = ? AND cm.role IN ('moderator', 'admin')
  `, [c.id]);

  res.json({
    success: true,
    data: {
      community: {
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        icon_url: c.icon_url,
        banner_url: c.banner_url,
        rules: JSON.parse(c.rules || '[]'),
        member_count: c.member_count,
        is_official: c.is_official,
        created_at: c.created_at,
        is_member: isMember,
        user_role: userRoleInCommunity,
        moderators
      }
    }
  });
});

// POST /api/v1/communities/:slug/join (Toggle membership)
communitiesRouter.post('/:slug/join', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const slug = req.params.slug;

  const community = get<any>('SELECT id, member_count FROM communities WHERE slug = ?', [slug]);
  if (!community) {
    return res.status(404).json({ success: false, error: { code: 'COMMUNITY_NOT_FOUND', message: 'Community not found' } });
  }

  const existing = get<any>('SELECT 1 FROM community_members WHERE community_id = ? AND user_id = ?', [community.id, userId]);

  transaction(() => {
    if (existing) {
      run('DELETE FROM community_members WHERE community_id = ? AND user_id = ?', [community.id, userId]);
      run('UPDATE communities SET member_count = MAX(0, member_count - 1) WHERE id = ?', [community.id]);
    } else {
      run('INSERT INTO community_members (community_id, user_id, role) VALUES (?, ?, "member")', [community.id, userId]);
      run('UPDATE communities SET member_count = member_count + 1 WHERE id = ?', [community.id]);
    }
  });

  const isMember = !existing;
  const updated = get<any>('SELECT member_count FROM communities WHERE id = ?', [community.id]);

  res.json({
    success: true,
    data: {
      isMember,
      memberCount: updated.member_count,
      message: isMember ? `Joined /c/${slug}` : `Left /c/${slug}`
    }
  });
});

// POST /api/v1/communities (Create community)
communitiesRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { name, slug, description, rules, iconUrl } = req.body;

  if (!name || !slug || !description) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Name, slug, and description are required.' }
    });
  }

  const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const existing = get<any>('SELECT id FROM communities WHERE slug = ?', [normalizedSlug]);
  if (existing) {
    return res.status(409).json({
      success: false,
      error: { code: 'COMMUNITY_EXISTS', message: 'A community with this slug already exists.' }
    });
  }

  const commId = `c-${normalizedSlug}`;

  transaction(() => {
    run(`
      INSERT INTO communities (id, slug, name, description, icon_url, banner_url, rules, member_count, is_official, created_by)
      VALUES (?, ?, ?, ?, ?, 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', ?, 1, 0, ?)
    `, [
      commId,
      normalizedSlug,
      name,
      description,
      iconUrl || '🏛️',
      JSON.stringify(rules || ['Be respectful.', 'Follow SIT academic integrity.']),
      userId
    ]);

    run('INSERT INTO community_members (community_id, user_id, role) VALUES (?, ?, "moderator")', [commId, userId]);
  });

  res.status(201).json({
    success: true,
    data: {
      communityId: commId,
      slug: normalizedSlug,
      message: 'Community successfully created.'
    }
  });
});

