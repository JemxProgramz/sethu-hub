import { z } from 'zod';

export const postAnalyzerSchema = z.object({
  topic: z.string().min(2),
  category: z.string().min(2),
  intent: z.enum(['question', 'discussion', 'collaboration', 'sharing', 'announcement', 'feedback']),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  department_relevance: z.array(z.string()),
  suggested_tags: z.array(z.string()),
  suggested_community_slug: z.string().optional(),
  enhanced_title: z.string().optional(),
  collaboration_potential: z.boolean(),
  confidence: z.number().min(0).max(1),
  summary: z.string().optional()
});

export const duplicateDetectorSchema = z.object({
  has_similar: z.boolean(),
  similarity_score: z.number().min(0).max(1),
  similar_posts: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      similarity: z.number(),
      community: z.string()
    })
  )
});

export const summarizerSchema = z.object({
  main_question: z.string(),
  key_arguments: z.array(z.string()),
  common_opinions: z.array(z.string()),
  disagreements: z.array(z.string()),
  useful_resources: z.array(z.string()),
  final_takeaways: z.array(z.string()),
  confidence: z.number().min(0).max(1)
});

export const moderationSchema = z.object({
  is_safe: z.boolean(),
  risk_score: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  category: z.string().optional(),
  reasoning: z.string().optional(),
  requires_human_review: z.boolean()
});

export const teamMatcherSchema = z.object({
  project_id: z.string(),
  candidates: z.array(
    z.object({
      user_id: z.string(),
      username: z.string(),
      display_name: z.string(),
      department: z.string(),
      year: z.number().optional(),
      match_score: z.number().min(0).max(100),
      matching_skills: z.array(z.string()),
      matching_interests: z.array(z.string()),
      match_rationale: z.string()
    })
  )
});

export const ideaMinerSchema = z.object({
  detected: z.boolean(),
  opportunity: z.object({
    title: z.string(),
    problem_statement: z.string(),
    evidence_post_ids: z.array(z.string()),
    evidence_snippets: z.array(z.string()),
    affected_departments: z.array(z.string()),
    suggested_solutions: z.array(z.string()),
    required_skills: z.array(z.string())
  }).optional()
});

export const ragAnswerSchema = z.object({
  question: z.string(),
  answer: z.string(),
  confidence: z.number().min(0).max(1),
  citations: z.array(
    z.object({
      postId: z.string(),
      title: z.string(),
      author: z.string(),
      relevanceScore: z.number()
    })
  )
});

export function validateAIOutput<T>(schema: z.ZodSchema<T>, data: any, fallback: T): T {
  try {
    return schema.parse(data);
  } catch (err) {
    console.warn('[AI_VALIDATOR] Output schema mismatch, applying fallback:', err);
    return fallback;
  }
}

