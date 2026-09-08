import { Router, Response } from 'express';
import { query, get, run, transaction } from '../../database/db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { Comment } from '../models/types.js';

export const commentsRouter = Router();

// GET /api/v1/posts/:id/comments (Returns hierarchical nested comment tree)
commentsRouter.get('/posts/:id/comments', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user?.userId;
  const postId = req.params.id;

  const rawComments = query<any>(`
    SELECT
      c.*,
      u.username as author_username,
      u.role as author_role,
      pr.display_name as author_display_name,
      pr.avatar_url as author_avatar,
      pr.department as author_dept
    FROM comments c
    JOIN users u ON c.author_id = u.id
    LEFT JOIN profiles pr ON u.id = pr.user_id
    WHERE c.post_id = ? AND c.is_deleted = 0
    ORDER BY c.is_accepted_answer DESC, c.upvotes_count DESC, c.created_at ASC
  `, [postId]);

  // Build nested reply tree
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  for (const rc of rawComments) {
    let userVote = 0;
    if (currentUserId) {
      const vote = get<any>('SELECT vote_value FROM votes WHERE user_id = ? AND target_type = \'comment\' AND target_id = ?', [currentUserId, rc.id]);
      if (vote) userVote = vote.vote_value;
    }

    const commentObj: Comment = {
      ...rc,
      user_vote: userVote,
      replies: []
    };

    commentMap.set(rc.id, commentObj);
  }

  for (const rc of rawComments) {
    const commentObj = commentMap.get(rc.id)!;
    if (rc.parent_id && commentMap.has(rc.parent_id)) {
      commentMap.get(rc.parent_id)!.replies!.push(commentObj);
    } else {
      rootComments.push(commentObj);
    }
  }

  res.json({
    success: true,
    data: {
      comments: rootComments,
      totalCount: rawComments.length
    }
  });
});

// POST /api/v1/posts/:id/comments (Add root comment or nested reply)
commentsRouter.post('/posts/:id/comments', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const postId = req.params.id;
  const { content, parentId } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: { code: 'EMPTY_CONTENT', message: 'Comment text cannot be empty.' }
    });
  }

  const post = get<any>('SELECT id, author_id, title FROM posts WHERE id = ?', [postId]);
  if (!post) {
    return res.status(404).json({
      success: false,
      error: { code: 'POST_NOT_FOUND', message: 'Post not found.' }
    });
  }

  const commentId = `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    transaction(() => {
      run(`
        INSERT INTO comments (id, post_id, author_id, parent_id, content, upvotes_count, downvotes_count, is_accepted_answer)
        VALUES (?, ?, ?, ?, ?, 1, 0, 0)
      `, [commentId, postId, userId, parentId || null, content.trim()]);

      // Automatically add author upvote
      run('INSERT INTO votes (id, user_id, target_type, target_id, vote_value) VALUES (?, ?, \'comment\', ?, 1)', [
        `vote-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId,
        commentId
      ]);

      // Increment comments count on post
      run('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?', [postId]);

      // Add notification for post author (if not self)
      if (post.author_id !== userId) {
        run(`
          INSERT INTO notifications (id, user_id, sender_id, type, title, message, link)
          VALUES (?, ?, ?, 'comment', 'New Comment', 'Someone commented on your post', ?)
        `, [
          `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          post.author_id,
          userId,
          `/post/${postId}`
        ]);
      }
    });

    res.status(201).json({
      success: true,
      data: {
        commentId,
        message: 'Comment posted successfully.'
      }
    });
  } catch (err) {
    console.error('Failed to post comment:', err);
    res.status(500).json({
      success: false,
      error: { code: 'COMMENT_FAILED', message: 'Failed to submit comment.' }
    });
  }
});

// POST /api/v1/comments/:id/vote
commentsRouter.post('/comments/:id/vote', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const commentId = req.params.id;
  const { voteValue } = req.body;

  const comment = get<any>('SELECT id, author_id, post_id FROM comments WHERE id = ?', [commentId]);
  if (!comment) {
    return res.status(404).json({ success: false, error: { code: 'COMMENT_NOT_FOUND', message: 'Comment not found' } });
  }

  const existingVote = get<any>('SELECT vote_value FROM votes WHERE user_id = ? AND target_type = \'comment\' AND target_id = ?', [userId, commentId]);

  transaction(() => {
    if (voteValue === 0) {
      if (existingVote) {
        run('DELETE FROM votes WHERE user_id = ? AND target_type = \'comment\' AND target_id = ?', [userId, commentId]);
        if (existingVote.vote_value === 1) {
          run('UPDATE comments SET upvotes_count = MAX(0, upvotes_count - 1) WHERE id = ?', [commentId]);
          run('UPDATE users SET reputation = MAX(0, reputation - 5) WHERE id = ?', [comment.author_id]);
        } else {
          run('UPDATE comments SET downvotes_count = MAX(0, downvotes_count - 1) WHERE id = ?', [commentId]);
        }
      }
    } else {
      if (!existingVote) {
        run('INSERT INTO votes (id, user_id, target_type, target_id, vote_value) VALUES (?, ?, \'comment\', ?, ?)', [
          `vote-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId,
          commentId,
          voteValue
        ]);
        if (voteValue === 1) {
          run('UPDATE comments SET upvotes_count = upvotes_count + 1 WHERE id = ?', [commentId]);
          run('UPDATE users SET reputation = reputation + 5 WHERE id = ?', [comment.author_id]);
        } else {
          run('UPDATE comments SET downvotes_count = downvotes_count + 1 WHERE id = ?', [commentId]);
        }
      } else if (existingVote.vote_value !== voteValue) {
        run('UPDATE votes SET vote_value = ? WHERE user_id = ? AND target_type = \'comment\' AND target_id = ?', [voteValue, userId, commentId]);
        if (voteValue === 1) {
          run('UPDATE comments SET upvotes_count = upvotes_count + 1, downvotes_count = MAX(0, downvotes_count - 1) WHERE id = ?', [commentId]);
        } else {
          run('UPDATE comments SET downvotes_count = downvotes_count + 1, upvotes_count = MAX(0, upvotes_count - 1) WHERE id = ?', [commentId]);
        }
      }
    }
  });

  const updated = get<any>('SELECT upvotes_count, downvotes_count FROM comments WHERE id = ?', [commentId]);

  res.json({
    success: true,
    data: {
      upvotesCount: updated.upvotes_count,
      downvotesCount: updated.downvotes_count,
      userVote: voteValue
    }
  });
});

// POST /api/v1/comments/:id/accept (Mark answer as Accepted in Q&A mode)
commentsRouter.post('/comments/:id/accept', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const commentId = req.params.id;

  const comment = get<any>('SELECT c.*, p.author_id as post_author_id, p.post_type FROM comments c JOIN posts p ON c.post_id = p.id WHERE c.id = ?', [commentId]);
  if (!comment) {
    return res.status(404).json({ success: false, error: { code: 'COMMENT_NOT_FOUND', message: 'Comment not found' } });
  }

  // Only post author or faculty/admin can accept an answer
  if (comment.post_author_id !== userId && !['faculty', 'admin'].includes(userRole)) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Only the question author or verified faculty can accept an answer.' }
    });
  }

  transaction(() => {
    // Unmark any previous accepted answer on this post
    run('UPDATE comments SET is_accepted_answer = 0 WHERE post_id = ?', [comment.post_id]);

    // Mark current
    run('UPDATE comments SET is_accepted_answer = 1 WHERE id = ?', [commentId]);
    run('UPDATE posts SET is_accepted_answer_set = 1 WHERE id = ?', [comment.post_id]);

    // Award +50 reputation points to the author of the accepted answer!
    run('UPDATE users SET reputation = reputation + 50 WHERE id = ?', [comment.author_id]);

    // Notify author of accepted answer
    run(`
      INSERT INTO notifications (id, user_id, sender_id, type, title, message, link)
      VALUES (?, ?, ?, 'accepted_answer', 'Solution Accepted! 🌟', 'Your answer was marked as the accepted solution (+50 rep)', ?)
    `, [
      `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      comment.author_id,
      userId,
      `/post/${comment.post_id}`
    ]);
  });

  res.json({
    success: true,
    data: { message: 'Answer marked as accepted solution.' }
  });
});

