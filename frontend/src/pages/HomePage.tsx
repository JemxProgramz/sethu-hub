import React, { useEffect, useState } from 'react';
import { PostItem, postService } from '../services/postService.js';
import { PostCard } from '../components/PostCard.js';

export const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await postService.getPosts({
        tab: 'home',
        type: 'all',
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
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <div className="border-b border-[#222] pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">What's happening at Sethu?</h1>
        <p className="text-sm text-[#888]">Latest discussions and projects from your campus.</p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-sm border border-[#111] p-6 animate-pulse bg-[#0A0A0A]">
              <div className="h-4 bg-[#222] rounded-sm w-1/4 mb-4" />
              <div className="h-5 bg-[#222] rounded-sm w-3/4 mb-3" />
              <div className="h-4 bg-[#222] rounded-sm w-full mb-2" />
              <div className="h-4 bg-[#222] rounded-sm w-2/3" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-sm bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-500">
          {error}
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <div className="rounded-sm border border-[#222] p-12 text-center bg-[#0A0A0A]">
          <h3 className="text-base font-medium text-[#EDEDED]">No discussions found</h3>
          <p className="mt-2 text-sm text-[#888]">Be the first to start a conversation.</p>
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
