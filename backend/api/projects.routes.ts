import { Router, Response } from 'express';
import { query, get, run, transaction } from '../../database/db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { AIOrchestrator } from '../../ai/orchestrator/orchestrator.js';

export const projectsRouter = Router();

// GET /api/v1/projects (List recruiting projects)
projectsRouter.get('/', optionalAuth, async (_req: AuthenticatedRequest, res: Response) => {
  const rawProjects = query<any>(`
    SELECT
      pr.*,
      p.id as post_id,
      p.title as post_title,
      p.content as post_content,
      p.upvotes_count,
      p.comments_count,
      u.id as author_id,
      u.username as author_username,
      prf.display_name as author_display_name,
      prf.avatar_url as author_avatar,
      prf.department as author_dept
    FROM projects pr
    JOIN posts p ON pr.post_id = p.id
    JOIN users u ON p.author_id = u.id
    LEFT JOIN profiles prf ON u.id = prf.user_id
    WHERE p.is_deleted = 0
    ORDER BY pr.created_at DESC
  `);

  const projects = rawProjects.map(p => {
    const members = query<any>(`
      SELECT pm.role_name, u.username, pr.display_name, pr.avatar_url, pr.department
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      LEFT JOIN profiles pr ON u.id = pr.user_id
      WHERE pm.project_id = ?
    `, [p.id]);

    return {
      id: p.id,
      postId: p.post_id,
      title: p.title,
      problemStatement: p.problem_statement,
      description: p.description,
      requiredSkills: JSON.parse(p.required_skills || '[]'),
      openRoles: JSON.parse(p.open_roles || '[]'),
      teamSize: p.team_size,
      status: p.status,
      createdAt: p.created_at,
      author: {
        id: p.author_id,
        username: p.author_username,
        displayName: p.author_display_name,
        avatarUrl: p.author_avatar,
        department: p.author_dept
      },
      members,
      upvotesCount: p.upvotes_count,
      commentsCount: p.comments_count
    };
  });

  res.json({
    success: true,
    data: { projects }
  });
});

// GET /api/v1/projects/:id (Get single project details)
projectsRouter.get('/:id', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const projectId = req.params.id;

  const pr = get<any>(`
    SELECT
      pr.*,
      p.id as post_id,
      p.title as post_title,
      p.content as post_content,
      u.id as author_id,
      u.username as author_username,
      prf.display_name as author_display_name,
      prf.avatar_url as author_avatar,
      prf.department as author_dept
    FROM projects pr
    JOIN posts p ON pr.post_id = p.id
    JOIN users u ON p.author_id = u.id
    LEFT JOIN profiles prf ON u.id = prf.user_id
    WHERE pr.id = ? OR pr.post_id = ?
  `, [projectId, projectId]);

  if (!pr) {
    return res.status(404).json({ success: false, error: { code: 'PROJECT_NOT_FOUND', message: 'Project not found' } });
  }

  const members = query<any>(`
    SELECT pm.role_name, pm.joined_at, u.id as user_id, u.username, prf.display_name, prf.avatar_url, prf.department
    FROM project_members pm
    JOIN users u ON pm.user_id = u.id
    LEFT JOIN profiles prf ON u.id = prf.user_id
    WHERE pm.project_id = ?
  `, [pr.id]);

  res.json({
    success: true,
    data: {
      project: {
        ...pr,
        required_skills: JSON.parse(pr.required_skills || '[]'),
        open_roles: JSON.parse(pr.open_roles || '[]'),
        members
      }
    }
  });
});

// POST /api/v1/projects/:id/apply (Request to join a project)
projectsRouter.post('/:id/apply', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const projectId = req.params.id;
  const { roleApplied, message } = req.body;

  const project = get<any>('SELECT pr.id, p.author_id, pr.title FROM projects pr JOIN posts p ON pr.post_id = p.id WHERE pr.id = ? OR pr.post_id = ?', [projectId, projectId]);
  if (!project) {
    return res.status(404).json({ success: false, error: { code: 'PROJECT_NOT_FOUND', message: 'Project not found' } });
  }

  if (project.author_id === userId) {
    return res.status(400).json({ success: false, error: { code: 'CANNOT_APPLY_OWN', message: 'You are the owner of this project.' } });
  }

  const existing = get<any>('SELECT 1 FROM project_requests WHERE project_id = ? AND user_id = ?', [project.id, userId]);
  if (existing) {
    return res.status(409).json({ success: false, error: { code: 'ALREADY_APPLIED', message: 'You have already submitted a join request for this project.' } });
  }

  const reqId = `preq-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  transaction(() => {
    run(`
      INSERT INTO project_requests (id, project_id, user_id, role_applied, message, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `, [reqId, project.id, userId, roleApplied || 'Collaborator', message || '']);

    // Send notification to project owner
    run(`
      INSERT INTO notifications (id, user_id, sender_id, type, title, message, link)
      VALUES (?, ?, ?, 'project_request', 'New Project Join Request', 'A student requested to join your project: ${project.title}', ?)
    `, [
      `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      project.author_id,
      userId,
      `/project/${project.id}`
    ]);
  });

  res.status(201).json({
    success: true,
    data: { message: 'Application sent to project lead.' }
  });
});

// GET /api/v1/projects/:id/team-match (Trigger Agent 6 Team Matcher)
projectsRouter.get('/:id/team-match', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const projectId = req.params.id;

  try {
    const matchResult = await AIOrchestrator.matchTeam(projectId);
    res.json({
      success: true,
      data: matchResult
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'TEAM_MATCH_ERROR', message: err.message || 'Failed to compute team matches' }
    });
  }
});

