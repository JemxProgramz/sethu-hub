import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CommunityItem, communityService } from '../services/communityService.js';
import { PostItem, postService } from '../services/postService.js';
import { PostCard } from '../components/PostCard.js';
import { useAuth } from '../hooks/useAuth.js';
import { Users, Shield, Plus, Check, Sparkles } from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [community, setCommunity] = useState<CommunityItem | null>(null);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    if (!slug) return;
    setIsLoading(true);
    try {
      const [commRes, postsRes] = await Promise.all([
        communityService.getCommunity(slug),
        postService.getPosts({ community: slug, limit: 20 })
      ]);
      setCommunity(commRes.community);
      setIsMember(commRes.community.is_member || false);
      setMemberCount(commRes.community.member_count);
      setPosts(postsRes.posts);
    } catch (err) {
      console.error('Failed to load community:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  const handleToggleJoin = async () => {
    if (!slug || !user) return;
    try {
      const res = await communityService.toggleJoin(slug);
      setIsMember(res.isMember);
      setMemberCount(res.memberCount);
    } catch (err) {
      console.error('Toggle join failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-xs text-[#888]">
        <Sparkles className="h-6 w-6 text-[#EDEDED] animate-spin mx-auto mb-2" />
        <span>Loading community hub...</span>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="text-center py-12 text-xs text-[#888]">
        Community not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Community Banner & Header */}
      <div className="rounded-sm bg-[#0A0A0A] border border-[#222] overflow-hidden">
        <div
          className="h-32 sm:h-40 w-full"
          style={{ background: community.banner_url || 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}
        />

        <div className="p-4 sm:p-6 -mt-12 sm:-mt-14 relative flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-end gap-3 sm:gap-4">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-sm bg-[#050505] border-4 border-[#111827] flex items-center justify-center text-4xl shadow-xl">
              {community.icon_url || '🏛️'}
            </div>
            <div className="mb-1">
              <h1 className="text-xl sm:text-2xl font-semibold text-white">{community.name}</h1>
              <p className="text-xs text-[#EDEDED] font-semibold">/c/{community.slug}</p>
            </div>
          </div>

          <button
            onClick={handleToggleJoin}
            className={`rounded-sm px-5 py-2 text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 ${
              isMember
                ? 'bg-[#111] text-gray-200 border border-[#333] hover:bg-rose-500/20 hover:text-rose-300'
                : 'bg-[#EDEDED] text-black hover:bg-white text-white '
            }`}
          >
            {isMember ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Plus className="h-3.5 w-3.5" />}
            <span>{isMember ? 'Joined' : 'Join Hub'}</span>
          </button>
        </div>

        <div className="px-6 pb-6 pt-2 text-xs text-gray-300 border-t border-[#222]/50 flex flex-wrap items-center gap-6">
          <span className="flex items-center gap-1.5 font-semibold text-gray-200">
            <Users className="h-4 w-4 text-[#EDEDED]" />
            <span>{memberCount} SIT Members</span>
          </span>
          <p className="text-[#888] leading-relaxed max-w-2xl">{community.description}</p>
        </div>
      </div>

      {/* Community Feed Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#222]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#888]">
            Discussions in /c/{community.slug}
          </h2>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-sm bg-[#0A0A0A] border border-[#222] p-8 text-center text-xs text-[#888]">
            No discussions posted in this hub yet. Be the first to share!
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdated={loadData} />
          ))
        )}
      </div>
    </div>
  );
};

