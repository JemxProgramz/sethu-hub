import { request } from './api.js';

export interface CommunityItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_url?: string;
  banner_url?: string;
  rules: string[];
  member_count: number;
  is_official: number;
  created_at: string;
  is_member?: boolean;
  user_role?: string | null;
  moderators?: Array<{
    username: string;
    display_name: string;
    avatar_url?: string;
  }>;
}

export const communityService = {
  async getCommunities(): Promise<{ communities: CommunityItem[] }> {
    return request<{ communities: CommunityItem[] }>('/communities');
  },

  async getCommunity(slug: string): Promise<{ community: CommunityItem }> {
    return request<{ community: CommunityItem }>(`/communities/${slug}`);
  },

  async toggleJoin(slug: string): Promise<{ isMember: boolean; memberCount: number; message: string }> {
    return request<{ isMember: boolean; memberCount: number; message: string }>(`/communities/${slug}/join`, {
      method: 'POST'
    });
  },

  async createCommunity(data: { name: string; slug: string; description: string; rules?: string[]; iconUrl?: string }): Promise<{ communityId: string; slug: string }> {
    return request<{ communityId: string; slug: string }>('/communities', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

