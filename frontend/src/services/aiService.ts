import { request } from './api.js';

export interface AIDraftAnalysis {
  analysis: {
    topic: string;
    category: string;
    intent: string;
    sentiment: string;
    difficulty?: string;
    department_relevance: string[];
    suggested_tags: string[];
    suggested_community_slug?: string;
    enhanced_title?: string;
    collaboration_potential: boolean;
    confidence: number;
    summary?: string;
  };
  duplicates: {
    has_similar: boolean;
    similarity_score: number;
    similar_posts: Array<{
      id: string;
      title: string;
      similarity: number;
      community: string;
    }>;
  };
}

export interface AISummary {
  main_question: string;
  key_arguments: string[];
  common_opinions: string[];
  disagreements: string[];
  useful_resources: string[];
  final_takeaways: string[];
  confidence: number;
}

export interface RAGAnswer {
  question: string;
  answer: string;
  confidence: number;
  citations: Array<{
    postId: string;
    title: string;
    author: string;
    relevanceScore: number;
  }>;
}

export interface TrendItem {
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

export interface InnovationItem {
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

export interface KnowledgeGraphData {
  nodes: Array<{ id: string; type: string; label: string; metadata?: any }>;
  edges: Array<{ id: string; source: string; target: string; label: string; weight: number }>;
}

export const aiService = {
  async analyzeDraft(data: {
    title: string;
    content: string;
    communitySlug?: string;
    postType?: string;
  }): Promise<AIDraftAnalysis> {
    return request<AIDraftAnalysis>('/ai/analyze-draft', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async summarizePost(postId: string): Promise<AISummary> {
    return request<AISummary>('/ai/summarize-post', {
      method: 'POST',
      body: JSON.stringify({ postId })
    });
  },

  async askSethuAI(question: string): Promise<RAGAnswer> {
    return request<RAGAnswer>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ question })
    });
  },

  async getTrends(): Promise<{ trends: TrendItem[] }> {
    return request<{ trends: TrendItem[] }>('/ai/trends');
  },

  async getInnovations(): Promise<{ innovations: InnovationItem[] }> {
    return request<{ innovations: InnovationItem[] }>('/ai/innovations');
  },

  async triggerIdeaMining(): Promise<{ message: string; innovations: InnovationItem[] }> {
    return request<{ message: string; innovations: InnovationItem[] }>('/ai/mine-innovations', {
      method: 'POST'
    });
  },

  async getSentiment(topic?: string): Promise<any> {
    const query = topic ? `?topic=${encodeURIComponent(topic)}` : '';
    return request<any>(`/ai/sentiment${query}`);
  },

  async getKnowledgeGraph(): Promise<KnowledgeGraphData> {
    return request<KnowledgeGraphData>('/ai/knowledge-graph');
  },

  async getTeamMatch(projectId: string): Promise<{ project_id: string; candidates: any[] }> {
    return request<{ project_id: string; candidates: any[] }>(`/projects/${projectId}/team-match`);
  }
};

