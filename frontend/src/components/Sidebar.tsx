import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { communityService } from '../services/communityService.js';
import { Home, Users, Rocket, Calendar, Search, User, Shield } from 'lucide-react';

const DEFAULT_COMMUNITIES = [
  { slug: 'csd', name: 'Computer Science & Design' },
  { slug: 'cse', name: 'Computer Science & Eng' },
  { slug: 'ai-ml', name: 'AI & Machine Learning' },
  { slug: 'ece', name: 'Electronics & Comm' },
  { slug: 'projects', name: 'Project Collaboration' },
  { slug: 'hackathons', name: 'Hackathons & Contests' },
  { slug: 'placements', name: 'Placements & Careers' },
  { slug: 'campus-life', name: 'Campus Life & Transport' }
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Array<{ slug: string; name: string }>>(DEFAULT_COMMUNITIES);

  useEffect(() => {
    communityService.getCommunities()
      .then(res => {
        if (res.communities && res.communities.length > 0) {
          setCommunities(res.communities.map(c => ({
            slug: c.slug,
            name: c.name
          })));
        }
      })
      .catch(() => {});
  }, []);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors ${
      isActive
        ? 'bg-[#111] text-[#EDEDED] font-medium border border-[#222]'
        : 'text-[#888] hover:text-[#EDEDED] hover:bg-[#0A0A0A] border border-transparent'
    }`;

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pr-6 border-r border-[#111]">
      <div className="space-y-8">
        {/* Navigation Core */}
        <div className="space-y-1">
          <NavLink to="/home" className={navClass}>
            <Home className="w-4 h-4" />
            <span>Home</span>
          </NavLink>
          <NavLink to="/explore" className={navClass}>
            <Users className="w-4 h-4" />
            <span>Communities</span>
          </NavLink>
          <NavLink to="/projects" className={navClass}>
            <Rocket className="w-4 h-4" />
            <span>Projects</span>
          </NavLink>
          <NavLink to="/events" className={navClass}>
            <Calendar className="w-4 h-4" />
            <span>Events</span>
          </NavLink>
          <NavLink to="/ask-ai" className={navClass}>
            <Search className="w-4 h-4" />
            <span>Ask Sethu</span>
          </NavLink>
          <NavLink to="/profile" className={navClass}>
            <User className="w-4 h-4" />
            <span>Profile</span>
          </NavLink>
        </div>

        {/* Communities Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3">
            <span className="text-xs font-medium text-[#666] uppercase tracking-wider">
              Communities
            </span>
          </div>
          <div className="space-y-0.5">
            {communities.slice(0, 8).map((c) => (
              <NavLink
                key={c.slug}
                to={`/c/${c.slug}`}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-sm px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? 'text-[#EDEDED] font-medium'
                      : 'text-[#888] hover:text-[#EDEDED]'
                  }`
                }
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#333]"></span>
                <span className="truncate">{c.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Administrative Roles */}
        {['moderator', 'admin'].includes(user?.role || '') && (
          <div className="space-y-2 pt-6 border-t border-[#111]">
            <div className="px-3">
              <span className="text-xs font-medium text-[#666] uppercase tracking-wider">
                Admin
              </span>
            </div>
            <NavLink to="/moderator" className={navClass}>
              <Shield className="w-4 h-4" />
              <span>Moderator Queue</span>
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navClass}>
                <Shield className="w-4 h-4" />
                <span>Admin Analytics</span>
              </NavLink>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
