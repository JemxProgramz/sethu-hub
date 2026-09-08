import { request } from './api.js';

export interface CommentItem {
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
  author_username: string;
  author_role: 'student' | 'faculty' | 'moderator' | 'admin';
  author_display_name: string;
  author_avatar?: string;
  author_dept?: string;
  user_vote?: number;
  replies?: CommentItem[];
}

export const commentService = {
  async getComments(postId: string): Promise<{ comments: CommentItem[]; totalCount: number }> {
    return request<{ comments: CommentItem[]; totalCount: number }>(`/posts/${postId}/comments`);
  },

  async addComment(postId: string, content: string, parentId?: string): Promise<{ commentId: string; message: string }> {
    return request<{ commentId: string; message: string }>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentId })
    });
  },

  async voteComment(commentId: string, voteValue: number): Promise<{ upvotesCount: number; downvotesCount: number; userVote: number }> {
    return request<{ upvotesCount: number; downvotesCount: number; userVote: number }>(`/comments/${commentId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteValue })
    });
  },

  async acceptAnswer(commentId: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/comments/${commentId}/accept`, {
      method: 'POST'
    });
  }
};

