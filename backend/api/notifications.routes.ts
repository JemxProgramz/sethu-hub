import { Router, Response } from 'express';
import { query, run } from '../../database/db.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

export const notificationsRouter = Router();

// GET /api/v1/notifications
notificationsRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;

  const notifications = query<any>(`
    SELECT n.*, u.username as sender_username, pr.display_name as sender_display_name, pr.avatar_url as sender_avatar
    FROM notifications n
    LEFT JOIN users u ON n.sender_id = u.id
    LEFT JOIN profiles pr ON u.id = pr.user_id
    WHERE n.user_id = ?
    ORDER BY n.created_at DESC
    LIMIT 30
  `, [userId]);

  const unreadCount = query<any>('SELECT COUNT(*) as cnt FROM notifications WHERE user_id = ? AND is_read = 0', [userId])[0]?.cnt || 0;

  res.json({
    success: true,
    data: {
      notifications,
      unreadCount
    }
  });
});

// PUT /api/v1/notifications/mark-read
notificationsRouter.put('/mark-read', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;

  run('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);

  res.json({
    success: true,
    data: { message: 'All notifications marked as read.' }
  });
});

