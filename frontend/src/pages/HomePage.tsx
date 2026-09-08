import React, { useEffect, useState } from 'react';
import { PostItem, postService } from '../services/postService.js';
import { PostCard } from '../components/PostCard.js';
import { Flame, Clock, Sparkles, UserCheck, Layers, Filter } from 'lucide-react';

const POST_TYPES = [
  { id: 'all', label: 'All Feeds' },
  { id: 'discussion', label: 'Discussions' },
  { id: 'question', label: 'Q&A (Accepted Answers)' },
  { id: 'project', label: 'Projects & Teams' },
  { id: 'opportunity', label: 'Opportunities' },
  { id: 'event', label: 'Events' },
  { id: 'poll', label: 'Polls' },
  { id: 'showcase', label: 'Showcases' }
];

export const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'popular' | 'latest' | 'following' | 'ai_recommended'>('home');
  const [activeType, setActiveType] = useState('all');
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await postService.getPosts({
        tab: activeTab,
        type: activeType,
        limit: 25
      });
      setPosts(res.posts);
    } catch (err: any) {
      setError(err.message || 'Failed to load posts feed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [activeTab, activeType]);

  return (
    <div className="space-y-4">
      {/* Primary Feed Tabs */}
      <div className="flex items-center gap-1 rounded-2xl bg-[#111827] border border-[#1F2937] p-1.5 overflow-x-auto">
        {[
          { id: 'home', label: 'Home', icon: Layers },
          { id: 'popular', label: 'Popular', icon: Flame },
          { id: 'latest', label: 'Latest', icon: Clock },
          { id: 'following', label: 'Following', icon: UserCheck },
          { id: 'ai_recommended', label: 'AI Recommended', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-[#1F2937]'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive && tab.id === 'ai_recommended' ? 'text-amber-300 animate-pulse' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Post Type Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1 pl-1 pr-2">
          <Filter className="h-3 w-3" /> Filter:
        </span>
        {POST_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveType(t.id)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors border ${
              activeType === t.id
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-[#111827] text-gray-400 border-[#1F2937] hover:border-gray-600 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Posts Stream */}
      {isLoading && (
        <div className="space-y-4 py-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-[#111827] border border-[#1F2937] p-6 animate-pulse">
              <div className="h-4 bg-gray-800 rounded w-1/3 mb-4" />
              <div className="h-6 bg-gray-800 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-800 rounded w-full mb-2" />
              <div className="h-4 bg-gray-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs text-rose-300">
          {error}
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-12 text-center">
          <Sparkles className="h-10 w-10 text-indigo-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No discussions found in this feed</h3>
          <p className="mt-1 text-xs text-gray-400">Be the first student or faculty member to start a discussion!</p>
        </div>
      )}

      {!isLoading && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdated={loadFeed} />
          ))}
        </div>
      )}
    </div>
  );
};

