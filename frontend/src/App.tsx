import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout.js';
import { HomePage } from './pages/HomePage.js';
import { PostDetailPage } from './pages/PostDetailPage.js';
import { CreatePostPage } from './pages/CreatePostPage.js';
import { CommunityPage } from './pages/CommunityPage.js';
import { ExploreCommunitiesPage } from './pages/ExploreCommunitiesPage.js';
import { ProjectsPage } from './pages/ProjectsPage.js';
import { AskSethuAIPage } from './pages/AskSethuAIPage.js';
import { TrendingPage } from './pages/TrendingPage.js';
import { InnovationHubPage } from './pages/InnovationHubPage.js';
import { KnowledgeGraphPage } from './pages/KnowledgeGraphPage.js';
import { SearchPage } from './pages/SearchPage.js';
import { UserProfilePage } from './pages/UserProfilePage.js';
import { NotificationsPage } from './pages/NotificationsPage.js';
import { ModeratorPage } from './pages/ModeratorPage.js';
import { AdminPage } from './pages/AdminPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/c/:slug" element={<CommunityPage />} />
        <Route path="/explore" element={<ExploreCommunitiesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectsPage />} />
        <Route path="/project/:id" element={<ProjectsPage />} />
        <Route path="/ask-ai" element={<AskSethuAIPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/innovation" element={<InnovationHubPage />} />
        <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/user/:username" element={<UserProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/moderator" element={<ModeratorPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
};

