import { Router, Response } from 'express';
import { query, get, run, transaction } from '../../database/db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createPostSchema, voteSchema } from '../schemas/post.schema.js';
import { AIOrchestrator } from '../../ai/orchestrator/orchestrator.js';
import { Post, UserRole } from '../models/types.js';

export const postsRouter = Router();

// GET /api/v1/posts (Home Feed with tabs, filters, and pagination)
postsRouter.get('/', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user?.userId;
  const tab = (req.query.tab as string) || 'home';
  const typeFilter = req.query.type as string;
  const communitySlug = req.query.community as string;
  const authorUsername = req.query.author as string;
  const tagFilter = req.query.tag as string;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 15));
  const offset = (page - 1) * limit;

  let whereClauses: string[] = ['p.is_deleted = 0'];
  const params: any[] = [];

  if (typeFilter && typeFilter !== 'all') {
    whereClauses.push('p.post_type = ?');
    params.push(typeFilter);
  }

  if (communitySlug) {
    whereClauses.push('c.slug = ?');
    params.push(communitySlug);
  }

  if (authorUsername) {
    whereClauses.push('u.username = ?');
    params.push(authorUsername);
  }

  if (tagFilter) {
    whereClauses.push('EXISTS (SELECT 1 FROM post_tags pt WHERE pt.post_id = p.id AND pt.tag = ?)');
    params.push(tagFilter);
  }

  // Handle feed tabs
  let orderBy = 'p.is_pinned DESC, p.created_at DESC';

  if (tab === 'popular') {
    orderBy = 'p.is_pinned DESC, (p.upvotes_count - p.downvotes_count) DESC, p.comments_count DESC';
  } else if (tab === 'latest') {
    orderBy = 'p.created_at DESC';
  } else if (tab === 'home' && currentUserId) {
    // Show posts from communities user belongs to
    whereClauses.push('EXISTS (SELECT 1 FROM community_members cm WHERE cm.community_id = p.community_id AND cm.user_id = ?)');
    params.push(currentUserId);
  } else if (tab === 'ai_recommended' && currentUserId) {
    // Recommend posts matching user department or skills
    const userProfile = get<any>('SELECT department, skills FROM profiles WHERE user_id = ?', [currentUserId]);
    if (userProfile) {
      whereClauses.push(`(
        p.community_id = ? OR
        EXISTS (SELECT 1 FROM ai_analyses aa WHERE aa.post_id = p.id AND aa.department_relevance LIKE ?)
      )`);
      params.push(`c-${userProfile.department.toLowerCase()}`);
      params.push(`%${userProfile.department}%`);
    }
  }

  const sql = `
    SELECT
      p.*,
      u.username as author_username,
      u.role as author_role,
      pr.display_name as author_display_name,
      pr.avatar_url as author_avatar,
      pr.department as author_dept,
      pr.year as author_year,
      c.slug as community_slug,
      c.name as community_name,
      c.icon_url as community_icon
    FROM posts p
    JOIN users u ON p.author_id = u.id
    LEFT JOIN profiles pr ON u.id = pr.user_id
    JOIN communities c ON p.community_id = c.id
    WHERE ${whereClauses.join(' AND ')}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  params.push(limit, offset);

  const rawPosts = query<any>(sql, params);

  // Hydrate tags, user votes, saves, and AI analysis for each post
  const posts: Post[] = rawPosts.map(p => {
    const tags = query<any>('SELECT tag FROM post_tags WHERE post_id = ?', [p.id]).map(t => t.tag);
    const aiAnalysis = get<any>('SELECT * FROM ai_analyses WHERE post_id = ?', [p.id]);

    let userVote = 0;
    let isSaved = false;

    if (currentUserId) {
      const vote = get<any>('SELECT vote_value FROM votes WHERE user_id = ? AND target_type = "post" AND target_id = ?', [currentUserId, p.id]);
      if (vote) userVote = vote.vote_value;

      const save = get<any>('SELECT 1 FROM saves WHERE user_id = ? AND post_id = ?', [currentUserId, p.id]);
      if (save) isSaved = true;
    }

    // Hydrate post-type specific payloads
    let projectData = null;
    if (p.post_type === 'project') {
      const proj = get<any>('SELECT * FROM projects WHERE post_id = ?', [p.id]);
      if (proj) {
        projectData = {
          ...proj,
          required_skills: JSON.parse(proj.required_skills || '[]'),
          open_roles: JSON.parse(proj.open_roles || '[]')
        };
      }
    }

    let pollData = null;
    if (p.post_type === 'poll') {
      const poll = get<any>('SELECT * FROM polls WHERE post_id = ?', [p.id]);
      if (poll) {
        const options = query<any>('SELECT * FROM poll_options WHERE poll_id = ?', [poll.id]);
        let userVotedOptionId: string | null = null;
        if (currentUserId) {
          const userVoteRecord = get<any>('SELECT option_id FROM poll_votes WHERE poll_id = ? AND user_id = ?', [poll.id, currentUserId]);
          if (userVoteRecord) userVotedOptionId = userVoteRecord.option_id;
        }
        pollData = {
          ...poll,
          options,
          userVotedOptionId
        };
      }
    }

    let eventData = null;
    if (p.post_type === 'event') {
      const ev = get<any>('SELECT * FROM events WHERE post_id = ?', [p.id]);
      if (ev) {
        let isRsvpd = false;
        if (currentUserId) {
          const rsvp = get<any>('SELECT 1 FROM event_rsvps WHERE event_id = ? AND user_id = ?', [ev.id, currentUserId]);
          if (rsvp) isRsvpd = true;
        }
        eventData = { ...ev, isRsvpd };
      }
    }

    return {
      id: p.id,
      author_id: p.author_id,
      community_id: p.community_id,
      title: p.title,
      content: p.content,
      post_type: p.post_type,
      metadata: JSON.parse(p.metadata || '{}'),
      upvotes_count: p.upvotes_count,
      downvotes_count: p.downvotes_count,
      comments_count: p.comments_count,
      is_accepted_answer_set: p.is_accepted_answer_set,
      is_pinned: p.is_pinned,
      is_locked: p.is_locked,
      is_deleted: p.is_deleted,
      is_demo: p.is_demo,
      created_at: p.created_at,
      updated_at: p.updated_at,
      author_username: p.author_username,
      author_role: p.author_role,
      author_display_name: p.author_display_name,
      author_avatar: p.author_avatar,
      author_dept: p.author_dept,
      author_year: p.author_year,
      community_slug: p.community_slug,
      community_name: p.community_name,
      community_icon: p.community_icon,
      tags,
      user_vote: userVote,
      is_saved: isSaved,
      ai_analysis: aiAnalysis ? {
        ...aiAnalysis,
        department_relevance: JSON.parse(aiAnalysis.department_relevance || '[]'),
        suggested_tags: JSON.parse(aiAnalysis.suggested_tags || '[]'),
        collaboration_potential: Boolean(aiAnalysis.collaboration_potential)
      } : undefined,
      project_data: projectData,
      poll_data: pollData,
      event_data: eventData
    };
  });

  res.json({
    success: true,
    data: {
      posts,
      page,
      limit,
      hasMore: rawPosts.length === limit
    }
  });
});

// GET /api/v1/posts/:id (Single post with deep details)
postsRouter.get('/:id', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user?.userId;
  const postId = req.params.id;

  const p = get<any>(`
    SELECT
      p.*,
      u.username as author_username,
      u.role as author_role,
      pr.display_name as author_display_name,
      pr.avatar_url as author_avatar,
      pr.department as author_dept,
      pr.year as author_year,
      c.slug as community_slug,
      c.name as community_name,
      c.icon_url as community_icon
    FROM posts p
    JOIN users u ON p.author_id = u.id
    LEFT JOIN profiles pr ON u.id = pr.user_id
    JOIN communities c ON p.community_id = c.id
    WHERE p.id = ? AND p.is_deleted = 0
  `, [postId]);

  if (!p) {
    return res.status(404).json({
      success: false,
      error: { code: 'POST_NOT_FOUND', message: 'The requested post was not found or has been removed.' }
    });
  }

  const tags = query<any>('SELECT tag FROM post_tags WHERE post_id = ?', [p.id]).map(t => t.tag);
  const aiAnalysis = get<any>('SELECT * FROM ai_analyses WHERE post_id = ?', [p.id]);

  let userVote = 0;
  let isSaved = false;

  if (currentUserId) {
    const vote = get<any>('SELECT vote_value FROM votes WHERE user_id = ? AND target_type = "post" AND target_id = ?', [currentUserId, p.id]);
    if (vote) userVote = vote.vote_value;

    const save = get<any>('SELECT 1 FROM saves WHERE user_id = ? AND post_id = ?', [currentUserId, p.id]);
    if (save) isSaved = true;
  }

  let projectData = null;
  if (p.post_type === 'project') {
    const proj = get<any>('SELECT * FROM projects WHERE post_id = ?', [p.id]);
    if (proj) {
      projectData = {
        ...proj,
        required_skills: JSON.parse(proj.required_skills || '[]'),
        open_roles: JSON.parse(proj.open_roles || '[]')
      };
    }
  }

  let pollData = null;
  if (p.post_type === 'poll') {
    const poll = get<any>('SELECT * FROM polls WHERE post_id = ?', [p.id]);
    if (poll) {
      const options = query<any>('SELECT * FROM poll_options WHERE poll_id = ?', [poll.id]);
      let userVotedOptionId: string | null = null;
      if (currentUserId) {
        const userVoteRecord = get<any>('SELECT option_id FROM poll_votes WHERE poll_id = ? AND user_id = ?', [poll.id, currentUserId]);
        if (userVoteRecord) userVotedOptionId = userVoteRecord.option_id;
      }
      pollData = { ...poll, options, userVotedOptionId };
    }
  }

  let eventData = null;
  if (p.post_type === 'event') {
    const ev = get<any>('SELECT * FROM events WHERE post_id = ?', [p.id]);
    if (ev) {
      let isRsvpd = false;
      if (currentUserId) {
        const rsvp = get<any>('SELECT 1 FROM event_rsvps WHERE event_id = ? AND user_id = ?', [ev.id, currentUserId]);
        if (rsvp) isRsvpd = true;
      }
      eventData = { ...ev, isRsvpd };
    }
  }

  res.json({
    success: true,
    data: {
      post: {
        ...p,
        metadata: JSON.parse(p.metadata || '{}'),
        tags,
        user_vote: userVote,
        is_saved: isSaved,
        ai_analysis: aiAnalysis ? {
          ...aiAnalysis,
          department_relevance: JSON.parse(aiAnalysis.department_relevance || '[]'),
          suggested_tags: JSON.parse(aiAnalysis.suggested_tags || '[]'),
          collaboration_potential: Boolean(aiAnalysis.collaboration_potential)
        } : undefined,
        project_data: projectData,
        poll_data: pollData,
        event_data: eventData
      }
    }
  });
});

// POST /api/v1/posts (Create a new post across 8 post types)
postsRouter.post('/', requireAuth, validateBody(createPostSchema), async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { communityId, title, content, postType, tags, metadata } = req.body;

  // Resolve community
  const community = get<any>('SELECT id, slug FROM communities WHERE id = ? OR slug = ?', [communityId, communityId]);
  if (!community) {
    return res.status(404).json({
      success: false,
      error: { code: 'COMMUNITY_NOT_FOUND', message: 'Target community not found.' }
    });
  }

  const postId = `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    transaction(() => {
      run(`
        INSERT INTO posts (id, author_id, community_id, title, content, post_type, metadata, upvotes_count, downvotes_count, comments_count, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, 0, 0)
      `, [
        postId,
        userId,
        community.id,
        title,
        content,
        postType || 'discussion',
        JSON.stringify(metadata || {})
      ]);

      // Automatically add author upvote
      run('INSERT INTO votes (id, user_id, target_type, target_id, vote_value) VALUES (?, ?, "post", ?, 1)', [
        `vote-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId,
        postId
      ]);

      // Tags
      if (Array.isArray(tags)) {
        for (const tag of tags) {
          run('INSERT OR IGNORE INTO post_tags (post_id, tag) VALUES (?, ?)', [postId, tag]);
        }
      }

      // Handle post-type specific table records
      if (postType === 'project') {
        run(`
          INSERT INTO projects (id, post_id, title, problem_statement, description, required_skills, open_roles, team_size, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'recruiting')
        `, [
          `proj-${postId}`,
          postId,
          title,
          metadata?.problem_statement || title,
          content,
          JSON.stringify(metadata?.required_skills || tags || []),
          JSON.stringify(metadata?.open_roles || [{ role: 'Collaborator', spots: 1 }]),
          metadata?.team_size || 3
        ]);

        run('INSERT INTO project_members (project_id, user_id, role_name) VALUES (?, ?, "Project Lead")', [
          `proj-${postId}`,
          userId
        ]);
      } else if (postType === 'poll') {
        const pollId = `poll-${postId}`;
        run('INSERT INTO polls (id, post_id, question, expires_at) VALUES (?, ?, ?, ?)', [
          pollId,
          postId,
          title,
          metadata?.expires_at || null
        ]);

        const options = metadata?.poll_options || ['Option 1', 'Option 2'];
        for (let idx = 0; idx < options.length; idx++) {
          run('INSERT INTO poll_options (id, poll_id, option_text, vote_count) VALUES (?, ?, ?, 0)', [
            `opt-${pollId}-${idx}`,
            pollId,
            options[idx]
          ]);
        }
      } else if (postType === 'event') {
        run(`
          INSERT INTO events (id, post_id, event_name, event_date, event_time, location, organizer, registration_link, rsvp_count)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        `, [
          `event-${postId}`,
          postId,
          metadata?.event_name || title,
          metadata?.event_date || new Date().toISOString().split('T')[0],
          metadata?.event_time || '10:00 AM',
          metadata?.location || 'SIT Campus',
          metadata?.organizer || 'SIT Community',
          metadata?.registration_link || null
        ]);

        run('INSERT INTO event_rsvps (event_id, user_id, status) VALUES (?, ?, "going")', [`event-${postId}`, userId]);
      }
    });

    // Award reputation points for creating a quality post (+10)
    run('UPDATE users SET reputation = reputation + 10 WHERE id = ?', [userId]);

    // Asynchronously dispatch AI Orchestrator processing
    AIOrchestrator.processPublishedPost(postId, title, content).catch(err => {
      console.error('[POST_PUBLISH_AI] Error:', err);
    });

    res.status(201).json({
      success: true,
      data: {
        postId,
        message: 'Post successfully published.'
      }
    });
  } catch (err) {
    console.error('Failed to create post:', err);
    res.status(500).json({
      success: false,
      error: { code: 'POST_CREATION_FAILED', message: 'Unable to publish post. Please try again.' }
    });
  }
});

// POST /api/v1/posts/:id/vote (Upvote/Downvote/Unvote)
postsRouter.post('/:id/vote', requireAuth, validateBody(voteSchema), async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const postId = req.params.id;
  const { voteValue } = req.body; // 1, -1, or 0 (cancel)

  const post = get<any>('SELECT id, author_id FROM posts WHERE id = ?', [postId]);
  if (!post) {
    return res.status(404).json({
      success: false,
      error: { code: 'POST_NOT_FOUND', message: 'Post not found.' }
    });
  }

  const existingVote = get<any>('SELECT vote_value FROM votes WHERE user_id = ? AND target_type = "post" AND target_id = ?', [userId, postId]);

  transaction(() => {
    if (voteValue === 0) {
      // Remove vote
      if (existingVote) {
        run('DELETE FROM votes WHERE user_id = ? AND target_type = "post" AND target_id = ?', [userId, postId]);
        if (existingVote.vote_value === 1) {
          run('UPDATE posts SET upvotes_count = MAX(0, upvotes_count - 1) WHERE id = ?', [postId]);
          run('UPDATE users SET reputation = MAX(0, reputation - 10) WHERE id = ?', [post.author_id]);
        } else {
          run('UPDATE posts SET downvotes_count = MAX(0, downvotes_count - 1) WHERE id = ?', [postId]);
        }
      }
    } else {
      // Insert or update vote
      if (!existingVote) {
        run('INSERT INTO votes (id, user_id, target_type, target_id, vote_value) VALUES (?, ?, "post", ?, ?)', [
          `vote-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId,
          postId,
          voteValue
        ]);
        if (voteValue === 1) {
          run('UPDATE posts SET upvotes_count = upvotes_count + 1 WHERE id = ?', [postId]);
          run('UPDATE users SET reputation = reputation + 10 WHERE id = ?', [post.author_id]);
        } else {
          run('UPDATE posts SET downvotes_count = downvotes_count + 1 WHERE id = ?', [postId]);
        }
      } else if (existingVote.vote_value !== voteValue) {
        run('UPDATE votes SET vote_value = ? WHERE user_id = ? AND target_type = "post" AND target_id = ?', [voteValue, userId, postId]);
        if (voteValue === 1) {
          run('UPDATE posts SET upvotes_count = upvotes_count + 1, downvotes_count = MAX(0, downvotes_count - 1) WHERE id = ?', [postId]);
          run('UPDATE users SET reputation = reputation + 15 WHERE id = ?', [post.author_id]);
        } else {
          run('UPDATE posts SET downvotes_count = downvotes_count + 1, upvotes_count = MAX(0, upvotes_count - 1) WHERE id = ?', [postId]);
          run('UPDATE users SET reputation = MAX(0, reputation - 15) WHERE id = ?', [post.author_id]);
        }
      }
    }
  });

  const updated = get<any>('SELECT upvotes_count, downvotes_count FROM posts WHERE id = ?', [postId]);

  res.json({
    success: true,
    data: {
      upvotesCount: updated.upvotes_count,
      downvotesCount: updated.downvotes_count,
      userVote: voteValue
    }
  });
});

// POST /api/v1/posts/:id/save (Toggle bookmark)
postsRouter.post('/:id/save', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const postId = req.params.id;

  const existing = get<any>('SELECT 1 FROM saves WHERE user_id = ? AND post_id = ?', [userId, postId]);

  if (existing) {
    run('DELETE FROM saves WHERE user_id = ? AND post_id = ?', [userId, postId]);
    return res.json({ success: true, data: { isSaved: false, message: 'Removed from saved posts' } });
  } else {
    run('INSERT INTO saves (user_id, post_id) VALUES (?, ?)', [userId, postId]);
    return res.json({ success: true, data: { isSaved: true, message: 'Saved to your profile' } });
  }
});

// POST /api/v1/posts/:id/report (User reporting system)
postsRouter.post('/:id/report', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const postId = req.params.id;
  const { reason, details } = req.body;

  const reportId = `rep-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  run(`
    INSERT INTO reports (id, reporter_id, target_type, target_id, reason, details, ai_risk_score, status)
    VALUES (?, ?, 'post', ?, ?, ?, 0.5, 'pending')
  `, [reportId, userId, postId, reason || 'other', details || '']);

  res.json({
    success: true,
    data: { message: 'Report submitted. Our moderation team will review this shortly.' }
  });
});

// DELETE /api/v1/posts/:id (Soft delete)
postsRouter.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const postId = req.params.id;

  const post = get<any>('SELECT author_id FROM posts WHERE id = ?', [postId]);
  if (!post) {
    return res.status(404).json({ success: false, error: { code: 'POST_NOT_FOUND', message: 'Post not found' } });
  }

  // Only author, moderator, or admin can delete
  if (post.author_id !== userId && !['moderator', 'admin'].includes(userRole)) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'You do not have permission to delete this post.' }
    });
  }

  run('UPDATE posts SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [postId]);

  res.json({
    success: true,
    data: { message: 'Post successfully deleted.' }
  });
});

