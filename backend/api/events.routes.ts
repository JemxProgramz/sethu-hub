import { Router, Response } from 'express';
import { get, run, transaction } from '../../database/db.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

export const eventsRouter = Router();

// POST /api/v1/events/:id/rsvp
eventsRouter.post('/:id/rsvp', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const eventId = req.params.id;

  const event = get<any>('SELECT * FROM events WHERE id = ? OR post_id = ?', [eventId, eventId]);
  if (!event) {
    return res.status(404).json({ success: false, error: { code: 'EVENT_NOT_FOUND', message: 'Event not found.' } });
  }

  const existingRsvp = get<any>('SELECT 1 FROM event_rsvps WHERE event_id = ? AND user_id = ?', [event.id, userId]);

  transaction(() => {
    if (existingRsvp) {
      run('DELETE FROM event_rsvps WHERE event_id = ? AND user_id = ?', [event.id, userId]);
      run('UPDATE events SET rsvp_count = MAX(0, rsvp_count - 1) WHERE id = ?', [event.id]);
    } else {
      run('INSERT INTO event_rsvps (event_id, user_id, status) VALUES (?, ?, "going")', [event.id, userId]);
      run('UPDATE events SET rsvp_count = rsvp_count + 1 WHERE id = ?', [event.id]);
    }
  });

  const isGoing = !existingRsvp;
  const updated = get<any>('SELECT rsvp_count FROM events WHERE id = ?', [event.id]);

  res.json({
    success: true,
    data: {
      isRsvpd: isGoing,
      rsvpCount: updated.rsvp_count,
      message: isGoing ? 'You are registered for this event.' : 'RSVP cancelled.'
    }
  });
});

