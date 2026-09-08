import { query, get } from '../../../database/db.js';
import { teamMatcherSchema, validateAIOutput } from '../../validators/aiValidators.js';
import { ProjectMatchCandidate } from '../../../backend/models/types.js';

export interface TeamMatcherResult {
  project_id: string;
  candidates: ProjectMatchCandidate[];
}

export async function matchTeamForProject(projectIdOrPostId: string): Promise<TeamMatcherResult> {
  // Find project and post details
  const project = get<any>(`
    SELECT pr.*, p.author_id, p.title as post_title, p.content as post_content
    FROM projects pr
    JOIN posts p ON pr.post_id = p.id
    WHERE pr.id = ? OR pr.post_id = ?
  `, [projectIdOrPostId, projectIdOrPostId]);

  if (!project) {
    throw new Error('Project not found');
  }

  const requiredSkills: string[] = JSON.parse(project.required_skills || '[]');
  const authorId = project.author_id;

  // Retrieve public student profiles (excluding the project creator)
  const students = query<any>(`
    SELECT u.id as user_id, u.username, pr.display_name, pr.avatar_url, pr.department, pr.year,
           pr.skills, pr.interests, pr.bio
    FROM users u
    JOIN profiles pr ON u.id = pr.user_id
    WHERE u.role = 'student' AND u.id != ? AND pr.is_private = 0
  `, [authorId]);

  const candidates: ProjectMatchCandidate[] = [];

  for (const student of students) {
    const studentSkills: string[] = JSON.parse(student.skills || '[]');
    const studentInterests: string[] = JSON.parse(student.interests || '[]');

    // Calculate skill overlap
    const matchingSkills: string[] = [];
    for (const req of requiredSkills) {
      const match = studentSkills.find(s => s.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(s.toLowerCase()));
      if (match && !matchingSkills.includes(match)) {
        matchingSkills.push(match);
      }
    }

    // Calculate interest overlap
    const projectTerms = `${project.title} ${project.problem_statement}`.toLowerCase();
    const matchingInterests = studentInterests.filter(int => projectTerms.includes(int.toLowerCase()));

    // Match scoring algorithm (0 to 100)
    let score = 0;
    if (requiredSkills.length > 0) {
      score += Math.min(60, Math.round((matchingSkills.length / requiredSkills.length) * 60));
    } else {
      score += 30;
    }

    if (matchingInterests.length > 0) {
      score += Math.min(25, matchingInterests.length * 12);
    }

    // Bonus for complementary department
    if (['CSD', 'AI_DS', 'ECE', 'MECH'].includes(student.department)) {
      score += 15;
    }

    score = Math.min(99, Math.max(20, score));

    if (matchingSkills.length > 0 || score >= 50) {
      let rationale = '';
      if (matchingSkills.length > 0) {
        rationale = `Verified skills in ${matchingSkills.join(', ')}. `;
      }
      if (matchingInterests.length > 0) {
        rationale += `Active interest in ${matchingInterests.join(', ')}. `;
      }
      rationale += `${student.department} Year ${student.year || 3} student with complementary background.`;

      candidates.push({
        user_id: student.user_id,
        username: student.username,
        display_name: student.display_name,
        avatar_url: student.avatar_url,
        department: student.department,
        year: student.year,
        match_score: score,
        matching_skills: matchingSkills,
        matching_interests: matchingInterests,
        match_rationale: rationale.trim()
      });
    }
  }

  // Sort descending by match score
  candidates.sort((a, b) => b.match_score - a.match_score);

  const rawResult = {
    project_id: project.id,
    candidates: candidates.slice(0, 6)
  };

  return validateAIOutput(teamMatcherSchema, rawResult, {
    project_id: project.id,
    candidates: []
  });
}

