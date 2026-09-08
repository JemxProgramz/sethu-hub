import { request } from './api.js';

export interface PostItem {
  id: string;
  author_id: string;
  community_id: string;
  title: string;
  content: string;
  post_type: 'discussion' | 'question' | 'project' | 'opportunity' | 'event' | 'announcement' | 'poll' | 'showcase';
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
  author_username: string;
  author_role: 'student' | 'faculty' | 'moderator' | 'admin';
  author_display_name: string;
  author_avatar?: string;
  author_dept?: string;
  author_year?: number;
  community_slug: string;
  community_name: string;
  community_icon?: string;
  tags: string[];
  user_vote?: number;
  is_saved?: boolean;
  ai_analysis?: {
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
  };
  project_data?: any;
  poll_data?: any;
  event_data?: any;
}

export const postService = {
  async getPosts(params: {
    tab?: string;
    type?: string;
    community?: string;
    author?: string;
    tag?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ posts: PostItem[]; hasMore: boolean; page: number }> {
    const query = new URLSearchParams();
    if (params.tab) query.append('tab', params.tab);
    if (params.type && params.type !== 'all') query.append('type', params.type);
    if (params.community) query.append('community', params.community);
    if (params.author) query.append('author', params.author);
    if (params.tag) query.append('tag', params.tag);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    return request<{ posts: PostItem[]; hasMore: boolean; page: number }>(`/posts?${query.toString()}`);
  },

  async getPost(id: string): Promise<{ post: PostItem }> {
    return request<{ post: PostItem }>(`/posts/${id}`);
  },

  async createPost(data: {
    communityId: string;
    title: string;
    content: string;
    postType: string;
    tags?: string[];
    metadata?: Record<string, any>;
  }): Promise<{ postId: string; message: string }> {
    return request<{ postId: string; message: string }>('/posts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async votePost(id: string, voteValue: number): Promise<{ upvotesCount: number; downvotesCount: number; userVote: number }> {
    return request<{ upvotesCount: number; downvotesCount: number; userVote: number }>(`/posts/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteValue })
    });
  },

  async toggleSave(id: string): Promise<{ isSaved: boolean; message: string }> {
    return request<{ isSaved: boolean; message: string }>(`/posts/${id}/save`, {
      method: 'POST'
    });
  },

  async reportPost(id: string, reason: string, details?: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/posts/${id}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, details })
    });
  },

  async deletePost(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/posts/${id}`, {
      method: 'DELETE'
    });
  },

  async votePoll(pollId: string, optionId: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/polls/${pollId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ optionId })
    });
  },

  async rsvpEvent(eventId: string): Promise<{ isRsvpd: boolean; rsvpCount: number; message: string }> {
    return request<{ isRsvpd: boolean; rsvpCount: number; message: string }>(`/events/${eventId}/rsvp`, {
      method: 'POST'
    });
  }
};

