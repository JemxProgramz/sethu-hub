import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import {
  Home,
  Compass,
  Rocket,
  Sparkles,
  TrendingUp,
  Lightbulb,
  Network,
  Shield,
  Briefcase,
  Layers,
  Plus
} from 'lucide-react';

const COMMUNITIES = [
  { slug: 'csd', name: 'Computer Science & Design', icon: '🎨' },
  { slug: 'cse', name: 'Computer Science & Eng', icon: '💻' },
  { slug: 'ai-ml', name: 'AI & Machine Learning', icon: '🤖' },
  { slug: 'ece', name: 'Electronics & Comm', icon: '⚡' },
  { slug: 'projects', name: 'Project Collaboration', icon: '🚀' },
  { slug: 'hackathons', name: 'Hackathons & Contests', icon: '🏆' },
  { slug: 'placements', name: 'Placements & Careers', icon: '💼' },
  { slug: 'campus-life', name: 'Campus Life & Transport', icon: '🚌' },
  { slug: 'startups', name: 'Startups & Incubation', icon: '💡' }
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
      isActive
        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-sm'
        : 'text-gray-400 hover:text-gray-200 hover:bg-[#111827]'
    }`;

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pr-3">
      <div className="space-y-6">
        {/* Navigation Core */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Navigation
          </div>

          <NavLink to="/home" className={navClass}>
            <Home className="h-4 w-4" />
            <span>Home Feed</span>
          </NavLink>

          <NavLink to="/explore" className={navClass}>
            <Compass className="h-4 w-4" />
            <span>Explore Communities</span>
          </NavLink>

          <NavLink to="/projects" className={navClass}>
            <Rocket className="h-4 w-4 text-emerald-400" />
            <span>Project Collaboration</span>
          </NavLink>

          <NavLink to="/ask-ai" className={navClass}>
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>Ask Sethu AI (RAG)</span>
          </NavLink>

          <NavLink to="/trending" className={navClass}>
            <TrendingUp className="h-4 w-4 text-amber-400" />
            <span>Campus Trends</span>
          </NavLink>

          <NavLink to="/innovation" className={navClass}>
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            <span>Innovation Hub</span>
          </NavLink>

          <NavLink to="/knowledge-graph" className={navClass}>
            <Network className="h-4 w-4 text-cyan-400" />
            <span>Knowledge Graph</span>
          </NavLink>
        </div>

        {/* Communities Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Communities
            </span>
            <Link to="/explore" className="text-[10px] text-indigo-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-0.5">
            {COMMUNITIES.map((c) => (
              <NavLink
                key={c.slug}
                to={`/c/${c.slug}`}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-colors ${
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-300 font-semibold border border-indigo-500/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#111827]'
                  }`
                }
              >
                <span className="text-sm">{c.icon}</span>
                <span className="truncate">{c.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Administrative Roles */}
        {['moderator', 'admin'].includes(user?.role || '') && (
          <div className="space-y-1 pt-2 border-t border-[#1F2937]">
            <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Moderation & Ops
            </div>

            <NavLink to="/moderator" className={navClass}>
              <Shield className="h-4 w-4 text-amber-400" />
              <span>Moderator Queue</span>
            </NavLink>

            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navClass}>
                <Briefcase className="h-4 w-4 text-purple-400" />
                <span>Admin Analytics</span>
              </NavLink>
            )}
          </div>
        )}

        {/* Transparent Demo Notice Badge */}
        <div className="rounded-2xl bg-gradient-to-br from-[#111827] to-[#182234] border border-[#1F2937] p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>DEMO MODE ACTIVE</span>
          </div>
          <p className="mt-1 text-[11px] text-gray-400 leading-relaxed">
            Populated with realistic fictional data for Sethu Institute of Technology.
          </p>
        </div>
      </div>
    </aside>
  );
};

