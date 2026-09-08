import { Router, Request, Response } from 'express';
import { query } from '../../database/db.js';
import { searchSemanticPosts } from '../../ai/retrieval/vectorSearch.js';

export const searchRouter = Router();

// GET /api/v1/search
searchRouter.get('/', async (req: Request, res: Response) => {
  const q = (req.query.q as string || '').trim();
  const filter = (req.query.filter as string) || 'all';

  if (!q) {
    return res.json({
      success: true,
      data: {
        posts: [],
        communities: [],
        users: []
      }
    });
  }

  // 1. Semantic Vector Search for Posts & Projects
  const semanticPosts = searchSemanticPosts(q, 10, 0.2);

  // 2. Keyword Search for Communities
  let matchingCommunities: any[] = [];
  if (filter === 'all' || filter === 'communities') {
    matchingCommunities = query<any>(`
      SELECT id, slug, name, description, icon_url, member_count
      FROM communities
      WHERE name LIKE ? OR description LIKE ? OR slug LIKE ?
      LIMIT 5
    `, [`%${q}%`, `%${q}%`, `%${q}%`]);
  }

  // 3. Keyword Search for Users & Faculty
  let matchingUsers: any[] = [];
  if (filter === 'all' || filter === 'users') {
    matchingUsers = query<any>(`
      SELECT u.id, u.username, u.role, pr.display_name, pr.avatar_url, pr.department, pr.skills
      FROM users u
      JOIN profiles pr ON u.id = pr.user_id
      WHERE u.username LIKE ? OR pr.display_name LIKE ? OR pr.department LIKE ? OR pr.skills LIKE ?
      LIMIT 6
    `, [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]).map(u => ({
      ...u,
      skills: JSON.parse(u.skills || '[]')
    }));
  }

  res.json({
    success: true,
    data: {
      query: q,
      posts: semanticPosts,
      communities: matchingCommunities,
      users: matchingUsers
    }
  });
});

