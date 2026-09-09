import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Rocket, Sparkles, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export const MobileNav: React.FC = () => {
  const { user } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
      isActive ? 'text-[#EDEDED] font-bold' : 'text-[#888] hover:text-gray-200'
    }`;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 border-t border-[#222] backdrop-blur-lg py-2.5 px-4 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <NavLink to="/home" className={navClass}>
          <Home className="h-5 w-5" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/explore" className={navClass}>
          <Compass className="h-5 w-5" />
          <span>Explore</span>
        </NavLink>

        <NavLink to="/projects" className={navClass}>
          <Rocket className="h-5 w-5 text-emerald-400" />
          <span>Projects</span>
        </NavLink>

        <NavLink to="/ask-ai" className={navClass}>
          <Sparkles className="h-5 w-5 text-[#888]" />
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


