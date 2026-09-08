import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CommunityItem, communityService } from '../services/communityService.js';
import { Search, Users, Plus, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export const ExploreCommunitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await communityService.getCommunities();
      setCommunities(res.communities);
    } catch (err) {
      console.error('Failed to load communities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleJoin = async (slug: string) => {
    if (!user) return;
    try {
      await communityService.toggleJoin(slug);
      await loadData();
    } catch (err) {
      console.error('Join error:', err);
    }
  };

  const filtered = communities.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white">SIT Communities Directory</h1>
          <p className="text-xs text-gray-400 mt-0.5">Explore departments, student clubs, hackathons, and technical societies</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-[#111827] border border-[#1F2937] py-1.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading communities directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-gray-700 transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{c.icon_url || '🏛️'}</span>
                    <div>
                      <Link to={`/c/${c.slug}`} className="text-sm font-bold text-white hover:text-indigo-400 transition-colors">
                        {c.name}
                      </Link>
                      <div className="text-[11px] text-indigo-400 font-semibold">/c/{c.slug}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleJoin(c.slug)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors flex items-center gap-1 ${
                      c.is_member
                        ? 'bg-[#182234] text-gray-300 border border-[#2D3748] hover:bg-rose-500/10'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                    }`}
                  >
                    {c.is_member ? <Check className="h-3 w-3 text-emerald-400" /> : <Plus className="h-3 w-3" />}
                    <span>{c.is_member ? 'Joined' : 'Join'}</span>
                  </button>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mt-2">
                  {c.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between text-[11px] text-gray-500">
                <span className="flex items-center gap-1 text-gray-400">
                  <Users className="h-3.5 w-3.5" />
                  <span>{c.member_count} members</span>
                </span>
                {c.is_official === 1 && (
                  <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Official SIT Hub
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

