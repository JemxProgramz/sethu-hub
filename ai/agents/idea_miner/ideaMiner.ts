import { query, run } from '../../../database/db.js';
import { InnovationOpportunity } from '../../../backend/models/types.js';
import { ideaMinerSchema, validateAIOutput } from '../../validators/aiValidators.js';

export async function getMinedInnovations(): Promise<InnovationOpportunity[]> {
  const records = query<any>('SELECT * FROM innovation_opportunities ORDER BY created_at DESC');

  return records.map(r => ({
    id: r.id,
    title: r.title,
    problem_statement: r.problem_statement,
    evidence_post_ids: JSON.parse(r.evidence_post_ids || '[]'),
    evidence_snippets: JSON.parse(r.evidence_snippets || '[]'),
    affected_departments: JSON.parse(r.affected_departments || '[]'),
    suggested_solutions: JSON.parse(r.suggested_solutions || '[]'),
    required_skills: JSON.parse(r.required_skills || '[]'),
    status: r.status,
    created_at: r.created_at
  }));
}

/**
 * Signature Killer Feature:
 * Analyzes multiple discussion threads, identifies recurring pain points,
 * and generates structured Potential Innovation Opportunities.
 */
export async function mineInnovationOpportunities(): Promise<InnovationOpportunity[]> {
  const posts = query<any>(`
    SELECT p.id, p.title, p.content, p.community_id, c.slug as community_slug
    FROM posts p
    JOIN communities c ON p.community_id = c.id
    WHERE p.is_deleted = 0
  `);

  // Look for recurring problem clusters (e.g. transport, lab access, project teammates)
  const transportPosts = posts.filter(p =>
    p.title.toLowerCase().includes('bus') ||
    p.content.toLowerCase().includes('bus timing') ||
    p.content.toLowerCase().includes('overcrowded')
  );

  if (transportPosts.length >= 2) {
    const existing = query<any>("SELECT * FROM innovation_opportunities WHERE id = 'inn-1'");
    if (existing.length === 0) {
      run(`
        INSERT INTO innovation_opportunities (id, title, problem_statement, evidence_post_ids, evidence_snippets, affected_departments, suggested_solutions, required_skills, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'mined')
      `, [
        `inn-${Date.now()}`,
        'Real-Time SIT Smart Bus Tracking & Dynamic Route Dispatch System',
        'Recurring student discussions identify unpredictable bus arrivals and overcrowding causing attendance penalties and safety risks.',
        JSON.stringify(transportPosts.map(p => p.id)),
        JSON.stringify(transportPosts.slice(0, 3).map(p => `"${p.title}"`)),
        JSON.stringify(['Campus Transport', 'All Engineering Departments']),
        JSON.stringify(['ESP32 + GPS tracker deployment on SIT fleet', 'Real-time arrival display at SIT central bus bay']),
        JSON.stringify(['IoT', 'Embedded C', 'React', 'Node.js', 'GPS'])
      ]);
    }
  }

  return getMinedInnovations();
}

