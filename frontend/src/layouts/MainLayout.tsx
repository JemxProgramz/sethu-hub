import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar.js';
import { Sidebar } from '../components/Sidebar.js';
import { RightSidebar } from '../components/RightSidebar.js';
import { MobileNav } from './MobileNav.js';
import { KillerDemoWalkthrough } from '../components/KillerDemoWalkthrough.js';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F9FAFB] flex flex-col">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-20 lg:pb-12">
        <Sidebar />

        <main className="flex-1 min-w-0 max-w-3xl mx-auto px-0 lg:px-6">
          <Outlet />
        </main>

        <RightSidebar />
      </div>

      <MobileNav />
      <KillerDemoWalkthrough />
    </div>
  );
};

