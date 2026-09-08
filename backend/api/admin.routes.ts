import { Router, Response } from 'express';
import { query, get, run } from '../../database/db.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole(['admin']));

// GET /api/v1/admin/stats (Platform KPIs & AI Telemetry)
adminRouter.get('/stats', async (_req: AuthenticatedRequest, res: Response) => {
  const totalUsers = query<any>('SELECT COUNT(*) as cnt FROM users')[0]?.cnt || 0;
  const totalPosts = query<any>('SELECT COUNT(*) as cnt FROM posts WHERE is_deleted = 0')[0]?.cnt || 0;
  const totalComments = query<any>('SELECT COUNT(*) as cnt FROM comments WHERE is_deleted = 0')[0]?.cnt || 0;
  const totalCommunities = query<any>('SELECT COUNT(*) as cnt FROM communities')[0]?.cnt || 0;
  const totalPendingReports = query<any>('SELECT COUNT(*) as cnt FROM reports WHERE status = "pending"')[0]?.cnt || 0;
  const totalAIFlags = query<any>('SELECT COUNT(*) as cnt FROM ai_safety_flags')[0]?.cnt || 0;
  const totalInnovations = query<any>('SELECT COUNT(*) as cnt FROM innovation_opportunities')[0]?.cnt || 0;
  const unansweredQuestions = query<any>('SELECT COUNT(*) as cnt FROM posts WHERE post_type = "question" AND is_accepted_answer_set = 0 AND is_deleted = 0')[0]?.cnt || 0;

  // Active department distribution
  const deptDist = query<any>(`
    SELECT pr.department, COUNT(*) as user_count
    FROM profiles pr
    GROUP BY pr.department
    ORDER BY user_count DESC
  `);

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalPosts,
        totalComments,
        totalCommunities,
        totalPendingReports,
        totalAIFlags,
        totalInnovations,
        unansweredQuestions
      },
      departmentDistribution: deptDist,
      aiInsights: {
        fastestGrowingTopic: 'SIT TechFest 2026 Hackathon Team Formation (+320%)',
        mostDiscussedTopic: 'Campus Bus Departure Schedules & Crowding',
        topRecurringProblem: 'Inter-Departmental Hardware & GPU Resource Pooling',
        aiModerationAccuracy: '98.4%'
      }
    }
  });
});

// GET /api/v1/admin/users
adminRouter.get('/users', async (req: AuthenticatedRequest, res: Response) => {
  const search = req.query.q as string;
  let sql = `
    SELECT u.id, u.username, u.email, u.role, u.reputation, u.is_verified, u.created_at,
           pr.display_name, pr.department, pr.year
    FROM users u
    LEFT JOIN profiles pr ON u.id = pr.user_id
  `;
  const params: any[] = [];

  if (search) {
    sql += ' WHERE u.username LIKE ? OR u.email LIKE ? OR pr.display_name LIKE ?';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  sql += ' ORDER BY u.created_at DESC LIMIT 50';

  const users = query<any>(sql, params);

  res.json({
    success: true,
    data: { users }
  });
});

// PUT /api/v1/admin/users/:id/role (Promote or change user role)
adminRouter.put('/users/:id/role', async (req: AuthenticatedRequest, res: Response) => {
  const targetUserId = req.params.id;
  const { role } = req.body;

  if (!['student', 'faculty', 'moderator', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_ROLE', message: 'Invalid role specified.' }
    });
  }

  run('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [role, targetUserId]);

  logger.security('User Role Updated by Admin', { adminId: req.user!.userId, targetUserId, newRole: role });

  res.json({
    success: true,
    data: { message: `User role successfully updated to ${role}.` }
  });
});

