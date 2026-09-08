import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusCircle, Sparkles, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export const MobileNav: React.FC = () => {
  const { user } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
      isActive ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
    }`;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 border-t border-[#1F2937] backdrop-blur-lg py-2 px-6">
      <div className="flex items-center justify-between">
        <NavLink to="/home" className={navClass}>
          <Home className="h-5 w-5" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/explore" className={navClass}>
          <Compass className="h-5 w-5" />
          <span>Explore</span>
        </NavLink>

        <NavLink to="/create" className={navClass}>
          <PlusCircle className="h-6 w-6 text-indigo-400" />
          <span className="font-bold text-white">Create</span>
        </NavLink>

        <NavLink to="/ask-ai" className={navClass}>
          <Sparkles className="h-5 w-5 text-purple-400" />
          <span>Ask AI</span>
        </NavLink>

        <NavLink to={`/user/${user?.username || 'me'}`} className={navClass}>
          <User className="h-5 w-5" />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};

