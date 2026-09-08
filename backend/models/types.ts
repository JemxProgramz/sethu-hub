export type UserRole = 'student' | 'faculty' | 'moderator' | 'admin';

export type PostType =
  | 'discussion'
  | 'question'
  | 'project'
  | 'opportunity'
  | 'event'
  | 'announcement'
  | 'poll'
  | 'showcase';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  is_verified: number;
  reputation: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  department: string;
  year?: number;
  skills: string[];
  interests: string[];
  is_private: number;
  created_at: string;
  updated_at: string;
}

export interface UserWithProfile extends User {
  profile?: Profile;
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_url?: string;
  banner_url?: string;
  rules: string[];
  member_count: number;
  is_official: number;
  created_by?: string;
  created_at: string;
  is_member?: boolean;
}

export interface Post {
  id: string;
  author_id: string;
  community_id: string;
  title: string;
  content: string;
  post_type: PostType;
  metadata: Record<string, any>;
  upvotes_count: number;
  downvotes_count: number;
  comments_count: number;
  is_accepted_answer_set: number;
  is_pinned: number;
  is_locked: number;
  is_deleted: number;
  is_demo: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  author_username?: string;
  author_display_name?: string;
  author_avatar?: string;
  author_role?: UserRole;
  author_dept?: string;
  author_year?: number;
  community_slug?: string;
  community_name?: string;
  community_icon?: string;
  tags?: string[];
  user_vote?: number; // 1, -1, or 0
  is_saved?: boolean;
  ai_analysis?: AIAnalysis;
  project_data?: any;
  poll_data?: any;
  event_data?: any;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id?: string | null;
  content: string;
  upvotes_count: number;
  downvotes_count: number;
  is_accepted_answer: number;
  is_deleted: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  author_username?: string;
  author_display_name?: string;
  author_avatar?: string;
  author_role?: UserRole;
  author_dept?: string;
  user_vote?: number;
  replies?: Comment[];
}

export interface AIAnalysis {
  id: string;
  post_id: string;
  topic: string;
  category: string;
  intent: string;
  sentiment: string;
  difficulty?: string;
  department_relevance: string[];
  suggested_tags: string[];
  collaboration_potential: boolean;
  confidence: number;
  summary?: string;
  created_at: string;
}

export interface Trend {
  id: string;
  topic: string;
  growth_percent: number;
  post_count: number;
  user_count: number;
  department?: string;
  velocity: string;
  summary: string;
  related_communities: string[];
  created_at: string;
}

export interface InnovationOpportunity {
  id: string;
  title: string;
  problem_statement: string;
  evidence_post_ids: string[];
  evidence_snippets: string[];
  affected_departments: string[];
  suggested_solutions: string[];
  required_skills: string[];
  status: 'mined' | 'validated' | 'incubated';
  created_at: string;
}

export interface ProjectMatchCandidate {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  department: string;
  year?: number;
  match_score: number; // 0-100
  matching_skills: string[];
  matching_interests: string[];
  match_rationale: string;
}

export interface AISummaryResult {
  post_id: string;
  comment_count_analyzed: number;
  main_question: string;
  key_arguments: string[];
  common_opinions: string[];
  disagreements: string[];
  useful_resources: string[];
  final_takeaways: string[];
}

export interface AISafetyResult {
  is_safe: boolean;
  risk_score: number;
  confidence: number;
  category?: string;
  reasoning?: string;
  requires_human_review: boolean;
}

