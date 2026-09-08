import { request } from './api.js';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'faculty' | 'moderator' | 'admin';
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  department: string;
  year?: number;
  reputation: number;
  skills: string[];
  interests: string[];
  badges?: Array<{
    slug: string;
    name: string;
    description: string;
    icon: string;
    category: string;
  }>;
}

export const authService = {
  async register(data: any): Promise<{ token: string; user: UserProfile }> {
    return request<{ token: string; user: UserProfile }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async login(login: string, password: string): Promise<{ token: string; user: UserProfile }> {
    return request<{ token: string; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password })
    });
  },

  async demoSwitch(role: 'student' | 'faculty' | 'moderator' | 'admin'): Promise<{ token: string; user: UserProfile }> {
    return request<{ token: string; user: UserProfile }>('/auth/demo-switch', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
  },

  async getMe(): Promise<UserProfile> {
    return request<UserProfile>('/auth/me');
  },

  async updateProfile(data: Partial<UserProfile>): Promise<void> {
    return request<void>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
};

