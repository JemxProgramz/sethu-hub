import { Router, Response } from 'express';
import { get, run, transaction } from '../../database/db.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

export const pollsRouter = Router();

// POST /api/v1/polls/:pollId/vote
pollsRouter.post('/:pollId/vote', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const pollId = req.params.pollId;
  const { optionId } = req.body;

  if (!optionId) {
    return res.status(400).json({ success: false, error: { code: 'OPTION_REQUIRED', message: 'Poll option required.' } });
  }

  const poll = get<any>('SELECT * FROM polls WHERE id = ?', [pollId]);
  if (!poll) {
    return res.status(404).json({ success: false, error: { code: 'POLL_NOT_FOUND', message: 'Poll not found.' } });
  }

  const existingVote = get<any>('SELECT option_id FROM poll_votes WHERE poll_id = ? AND user_id = ?', [pollId, userId]);

  transaction(() => {
    if (existingVote) {
      if (existingVote.option_id === optionId) {
        // Unvote
        run('DELETE FROM poll_votes WHERE poll_id = ? AND user_id = ?', [pollId, userId]);
        run('UPDATE poll_options SET vote_count = MAX(0, vote_count - 1) WHERE id = ?', [optionId]);
      } else {
        // Change vote
        run('UPDATE poll_options SET vote_count = MAX(0, vote_count - 1) WHERE id = ?', [existingVote.option_id]);
        run('UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = ?', [optionId]);
        run('UPDATE poll_votes SET option_id = ? WHERE poll_id = ? AND user_id = ?', [optionId, pollId, userId]);
      }
    } else {
      // Cast new vote
      run('INSERT INTO poll_votes (id, poll_id, option_id, user_id) VALUES (?, ?, ?, ?)', [
        `pv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        pollId,
        optionId,
        userId
      ]);
      run('UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = ?', [optionId]);
    }
  });

  res.json({
    success: true,
    data: { message: 'Vote recorded successfully.' }
  });
});

