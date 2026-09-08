import { Router, Response } from 'express';
import { query, get, run, transaction } from '../../database/db.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

export const moderatorRouter = Router();

// Middleware ensuring user has moderator or admin role
moderatorRouter.use(requireAuth, requireRole(['moderator', 'admin']));

// GET /api/v1/moderator/queue
moderatorRouter.get('/queue', async (_req: AuthenticatedRequest, res: Response) => {
  const reports = query<any>(`
    SELECT r.*, u.username as reporter_username,
           p.title as post_title, p.content as post_content,
           pu.username as target_author_username
    FROM reports r
    JOIN users u ON r.reporter_id = u.id
    LEFT JOIN posts p ON r.target_type = 'post' AND r.target_id = p.id
    LEFT JOIN users pu ON p.author_id = pu.id
    WHERE r.status = 'pending'
    ORDER BY r.ai_risk_score DESC, r.created_at DESC
  `);

  const aiFlags = query<any>(`
    SELECT f.*,
           p.title as post_title, p.content as post_content,
           u.username as author_username
    FROM ai_safety_flags f
    LEFT JOIN posts p ON f.target_type = 'post' AND f.target_id = p.id
    LEFT JOIN users u ON p.author_id = u.id
    WHERE f.status = 'pending_review'
    ORDER BY f.risk_score DESC, f.created_at DESC
  `);

  res.json({
    success: true,
    data: {
      reports,
      aiFlags,
      totalPending: reports.length + aiFlags.length
    }
  });
});

// POST /api/v1/moderator/action
moderatorRouter.post('/action', async (req: AuthenticatedRequest, res: Response) => {
  const moderatorId = req.user!.userId;
  const { targetType, targetId, action, notes, flagId, reportId } = req.body;

  if (!targetType || !targetId || !action) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Target type, target ID, and action are required.' }
    });
  }

  try {
    transaction(() => {
      // 1. Record moderation audit trail
      run(`
        INSERT INTO moderation_actions (id, moderator_id, target_type, target_id, action_taken, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        `modact-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        moderatorId,
        targetType,
        targetId,
        action,
        notes || ''
      ]);

      // 2. Perform enforcement
      if (action === 'remove') {
        if (targetType === 'post') {
          run('UPDATE posts SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [targetId]);
        } else if (targetType === 'comment') {
          run('UPDATE comments SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [targetId]);
        }
      }

      // 3. Update flag and report status
      if (flagId) {
        run('UPDATE ai_safety_flags SET status = ? WHERE id = ?', [action === 'remove' ? 'content_removed' : 'approved', flagId]);
      }
      if (reportId) {
        run('UPDATE reports SET status = ? WHERE id = ?', [action === 'remove' ? 'action_taken' : 'dismissed', reportId]);
      }
    });

    logger.security('Moderator Action Executed', { moderatorId, targetType, targetId, action });

    res.json({
      success: true,
      data: { message: `Action "${action}" recorded successfully.` }
    });
  } catch (err) {
    logger.error('Moderator action error:', err);
    res.status(500).json({
      success: false,
      error: { code: 'ACTION_FAILED', message: 'Failed to record moderation action.' }
    });
  }
});

