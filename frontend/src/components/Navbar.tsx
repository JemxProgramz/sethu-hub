import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import {
  Search,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Shield,
  GraduationCap,
  Briefcase,
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
    <header className="sticky top-0 z-40 w-full border-b border-[#111] bg-[#050505]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <Link to="/home" className="flex items-center gap-2 group">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold tracking-tight text-white text-sm">Sethu Hub</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 items-center gap-2">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-sm bg-[#0A0A0A] border border-[#222] py-1.5 pl-9 pr-4 text-sm text-white placeholder-[#555] focus:border-[#444] focus:outline-none transition-colors"
            />
          </form>
        </div>

        {/* Right: Actions, Demo Switcher, Profile */}
        <div className="flex items-center gap-3">
          <Link
            to="/create"
            className="hidden sm:flex items-center gap-1.5 rounded-sm bg-[#EDEDED] hover:bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors"
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
              className="flex items-center gap-1.5 rounded-sm bg-[#0A0A0A] border border-[#222] px-3 py-1.5 text-xs text-[#EDEDED] hover:border-[#444] transition-colors"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="capitalize">{user?.role || 'Role'}:</span>
              <span className="truncate max-w-[80px]">{user?.displayName?.split(' ')[0] || 'User'}</span>
              <ChevronDown className="h-3 w-3 text-[#666]" />
            </button>

            {isDemoDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-sm bg-[#0A0A0A] border border-[#222] p-1.5 shadow-lg z-50">
                <div className="px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-[#666] border-b border-[#222] mb-1">
                  Demo Switcher
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => { switchDemoRole('student'); setIsDemoDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2.5 rounded-sm px-3 py-2 text-xs text-left transition-colors ${
                      user?.role === 'student' ? 'bg-[#222] text-[#EDEDED]' : 'text-[#888] hover:bg-[#111] hover:text-[#EDEDED]'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Student (Karthik Raja)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { switchDemoRole('faculty'); setIsDemoDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2.5 rounded-sm px-3 py-2 text-xs text-left transition-colors ${
                      user?.role === 'faculty' ? 'bg-[#222] text-[#EDEDED]' : 'text-[#888] hover:bg-[#111] hover:text-[#EDEDED]'
                    }`}
                  >
                    <GraduationCap className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Faculty (Dr. Ramanathan)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { switchDemoRole('moderator'); setIsDemoDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2.5 rounded-sm px-3 py-2 text-xs text-left transition-colors ${
                      user?.role === 'moderator' ? 'bg-[#222] text-[#EDEDED]' : 'text-[#888] hover:bg-[#111] hover:text-[#EDEDED]'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Moderator (Priya M.)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { switchDemoRole('admin'); setIsDemoDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2.5 rounded-sm px-3 py-2 text-xs text-left transition-colors ${
                      user?.role === 'admin' ? 'bg-[#222] text-[#EDEDED]' : 'text-[#888] hover:bg-[#111] hover:text-[#EDEDED]'
                    }`}
                  >
                    <Briefcase className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Admin (SIT Ops)</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative flex h-8 w-8 items-center justify-center rounded-sm bg-[#0A0A0A] border border-[#222] text-[#666] hover:text-[#EDEDED] transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#EDEDED]" />
          </Link>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileDropdownOpen(!isProfileDropdownOpen);
                setIsDemoDropdownOpen(false);
              }}
              className="flex items-center gap-2 rounded-sm border border-[#222] p-1 pr-2 hover:border-[#444] transition-colors bg-[#0A0A0A]"
            >
              <div className="h-6 w-6 rounded-sm bg-[#222] flex items-center justify-center text-xs font-bold text-[#EDEDED]">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <ChevronDown className="h-3 w-3 text-[#666]" />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-sm bg-[#0A0A0A] border border-[#222] p-1.5 shadow-lg z-50">
                <Link
                  to="/profile"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-sm px-3 py-2 text-xs text-[#888] hover:text-[#EDEDED] hover:bg-[#111] transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 rounded-sm px-3 py-2 text-xs text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
