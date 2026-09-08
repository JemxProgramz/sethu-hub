import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import {
  Search,
  Sparkles,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Shield,
  GraduationCap,
  Briefcase,
  Flame,
  Plus
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1F2937] bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 transition-all">
              <span className="text-xl">🏛️</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white text-lg">SETHU</span>
                <span className="font-bold text-indigo-400 text-lg">HUB</span>
                <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  SIT
                </span>
              </div>
              <p className="text-[10px] font-medium text-gray-400 -mt-0.5">Where Sethu Connects</p>
            </div>
          </Link>
        </div>

        {/* Center: Search & Ask AI */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 items-center gap-2">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search discussions, projects, skills, or SIT communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-[#111827] border border-[#1F2937] py-2 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </form>
          <Link
            to="/ask-ai"
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600/10 border border-indigo-500/30 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/20 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Ask Sethu AI</span>
          </Link>
        </div>

        {/* Right: Actions, Demo Switcher, Profile */}
        <div className="flex items-center gap-3">
          <Link
            to="/create"
            className="hidden sm:flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Post</span>
          </Link>

          {/* Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setIsDemoDropdownOpen(!isDemoDropdownOpen);
                setIsProfileDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-[#111827] border border-[#1F2937] px-3 py-1.5 text-xs text-gray-200 hover:border-gray-600 transition-colors"
              title="One-click switch demo account"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-semibold capitalize text-indigo-300">{user?.role || 'Role'}:</span>
              <span className="truncate max-w-[80px]">{user?.displayName?.split(' ')[0] || 'User'}</span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>

            {isDemoDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#111827] border border-[#1F2937] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-[#1F2937]">
                  Demo Persona Switcher
                </div>
                <div className="mt-1 space-y-1">
                  <button
                    onClick={() => { switchDemoRole('student'); setIsDemoDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-left transition-colors ${
                      user?.role === 'student' ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-gray-300 hover:bg-[#1F2937]'
                    }`}
                  >
                    <User className="h-4 w-4 text-blue-400" />
                    <div>
                      <div className="font-medium">Student (Karthik Raja)</div>
                      <div className="text-[10px] text-gray-400">CSD 3rd Year • AI & UX</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { switchDemoRole('faculty'); setIsDemoDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-left transition-colors ${
                      user?.role === 'faculty' ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-gray-300 hover:bg-[#1F2937]'
                    }`}
                  >
                    <GraduationCap className="h-4 w-4 text-emerald-400" />
                    <div>
                      <div className="font-medium">Faculty (Dr. Ramanathan)</div>
                      <div className="text-[10px] text-gray-400">Professor CSE • Verified</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { switchDemoRole('moderator'); setIsDemoDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-left transition-colors ${
                      user?.role === 'moderator' ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-gray-300 hover:bg-[#1F2937]'
                    }`}
                  >
                    <Shield className="h-4 w-4 text-amber-400" />
                    <div>
                      <div className="font-medium">Moderator (Priya M.)</div>
                      <div className="text-[10px] text-gray-400">ECE 4th Year • SIT Lead</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { switchDemoRole('admin'); setIsDemoDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-left transition-colors ${
                      user?.role === 'admin' ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-gray-300 hover:bg-[#1F2937]'
                    }`}
                  >
                    <Briefcase className="h-4 w-4 text-purple-400" />
                    <div>
                      <div className="font-medium">Admin (SIT Ops)</div>
                      <div className="text-[10px] text-gray-400">Institutional Operations</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#111827] border border-[#1F2937] text-gray-400 hover:text-white transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500" />
          </Link>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileDropdownOpen(!isProfileDropdownOpen);
                setIsDemoDropdownOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl p-1 hover:bg-[#111827] transition-colors"
            >
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=user`}
                alt="Avatar"
                className="h-8 w-8 rounded-lg bg-indigo-950 border border-indigo-500/30 object-cover"
              />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#111827] border border-[#1F2937] p-2 shadow-2xl z-50">
                <div className="px-3 py-2 border-b border-[#1F2937]">
                  <div className="font-semibold text-sm text-white truncate">{user?.displayName}</div>
                  <div className="text-xs text-indigo-400 flex items-center gap-1 mt-0.5">
                    <Flame className="h-3 w-3 text-amber-400" />
                    <span>{user?.reputation || 0} Sethu Rep</span>
                  </div>
                </div>

                <div className="mt-1 space-y-1">
                  <Link
                    to={`/user/${user?.username}`}
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-gray-300 hover:bg-[#1F2937]"
                  >
                    <User className="h-4 w-4 text-gray-400" />
                    <span>My Profile</span>
                  </Link>

                  {['moderator', 'admin'].includes(user?.role || '') && (
                    <Link
                      to="/moderator"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-amber-300 hover:bg-[#1F2937]"
                    >
                      <Shield className="h-4 w-4 text-amber-400" />
                      <span>Moderator Queue</span>
                    </Link>
                  )}

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-purple-300 hover:bg-[#1F2937]"
                    >
                      <Briefcase className="h-4 w-4 text-purple-400" />
                      <span>Admin Portal</span>
                    </Link>
                  )}

                  <button
                    onClick={() => { logout(); setIsProfileDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

