import React, { useEffect, useState } from 'react';
import { request } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';
import {
  Briefcase,
  Users,
  MessageSquare,
  Sparkles,
  Shield,
  Lightbulb,
  Building2,
  TrendingUp,
  Activity,
  Lock
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        request<any>('/admin/stats'),
        request<any>('/admin/users')
      ]);
      setStats(statsRes);
      setUsersList(usersRes.users);
    } catch (err) {
      console.error('Admin load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="rounded-sm bg-[#0A0A0A] border border-[#222] p-12 text-center space-y-4 max-w-lg mx-auto mt-8">
        <Lock className="h-10 w-10 text-[#888] mx-auto" />
        <h2 className="text-lg font-bold text-white">Admin Access Required</h2>
        <p className="text-xs text-[#888]">
          This portal is restricted to authorized Sethu Institute of Technology administrators. Switch to an Admin persona using the top navigation persona menu to access.
        </p>
      </div>
    );
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await request(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-xs text-[#888]">Loading institutional telemetry...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-[#111] text-[#888] border border-[#333] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Administration
          </span>
          <span className="text-xs text-[#888]">Sethu Institute of Technology</span>
        </div>
        <h1 className="text-xl font-semibold text-white mt-1 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-[#888]" />
          <span>Admin</span>
        </h1>
        <p className="text-xs text-[#888] mt-0.5">
          Users, posts, and communities.
        </p>
      </div>

      {stats && (
        <div className="space-y-6">
          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-sm bg-[#0A0A0A] border border-[#222] p-4">
              <div className="text-[#888] text-xs font-medium flex items-center justify-between">
                <span>Total Users</span>
                <Users className="h-4 w-4 text-[#EDEDED]" />
              </div>
              <div className="text-2xl font-semibold text-white mt-2">{stats.stats.totalUsers}</div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-1">SIT Students & Faculty</div>
            </div>

            <div className="rounded-sm bg-[#0A0A0A] border border-[#222] p-4">
              <div className="text-[#888] text-xs font-medium flex items-center justify-between">
                <span>Discussions</span>
                <MessageSquare className="h-4 w-4 text-[#888]" />
              </div>
              <div className="text-2xl font-semibold text-white mt-2">{stats.stats.totalPosts}</div>
              <div className="text-[10px] text-[#888] mt-1">{stats.stats.totalComments} total comments</div>
            </div>

            <div className="rounded-sm bg-[#0A0A0A] border border-[#222] p-4">
              <div className="text-[#888] text-xs font-medium flex items-center justify-between">
                <span>Communities</span>
                <Building2 className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-semibold text-white mt-2">{stats.stats.totalCommunities}</div>
              <div className="text-[10px] text-cyan-400 font-semibold mt-1">Active Department Hubs</div>
            </div>

            <div className="rounded-sm bg-[#0A0A0A] border border-[#222] p-4">
              <div className="text-[#888] text-xs font-medium flex items-center justify-between">
                <span>Mined Ideas</span>
                <Lightbulb className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="text-2xl font-semibold text-white mt-2">{stats.stats.totalInnovations}</div>
              <div className="text-[10px] text-yellow-400 font-semibold mt-1">Incubation Opportunities</div>
            </div>
          </div>

          {/* Platform stats */}
          <div className="rounded-sm bg-[#0A0A0A] border border-[#222] p-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#888] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#888]" />
              <span>Platform Overview</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-sm bg-[#050505] p-3 border border-[#222]">
                <span className="text-[#888] font-semibold">Fastest-Growing Topic: </span>
                <span className="text-emerald-400 font-bold block mt-1">{stats.aiInsights.fastestGrowingTopic}</span>
              </div>
              <div className="rounded-sm bg-[#050505] p-3 border border-[#222]">
                <span className="text-[#888] font-semibold">Most Discussed Campus Concern: </span>
                <span className="text-amber-400 font-bold block mt-1">{stats.aiInsights.mostDiscussedTopic}</span>
              </div>
            </div>
          </div>

          {/* User Management Table */}
          <div className="rounded-sm bg-[#0A0A0A] border border-[#222] p-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Users
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="text-[11px] font-semibold text-[#888] uppercase border-b border-[#222] pb-2">
                  <tr>
                    <th className="py-2.5">User</th>
                    <th className="py-2.5">Department</th>
                    <th className="py-2.5">Reputation</th>
                    <th className="py-2.5">Role</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937]">
                  {usersList.slice(0, 15).map((u) => (
                    <tr key={u.id} className="hover:bg-[#111]/50">
                      <td className="py-3 font-medium text-white">
                        <div>{u.display_name || u.username}</div>
                        <div className="text-[10px] text-[#666]">@{u.username} • {u.email}</div>
                      </td>
                      <td className="py-3">{u.department || 'General'}</td>
                      <td className="py-3 font-bold text-amber-400">{u.reputation}</td>
                      <td className="py-3">
                        <span className="rounded bg-[#111] text-[#EDEDED] border border-[#333] px-2 py-0.5 text-[10px] font-bold uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="rounded-lg bg-[#050505] border border-[#222] px-2 py-1 text-[11px] text-white focus:outline-none"
                        >
                          <option value="student">Student</option>
                          <option value="faculty">Faculty</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

