import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { request } from '../services/api.js';
import { Search, Sparkles, MessageSquare, Users, Building2, Compass, ArrowRight } from 'lucide-react';

const SUGGESTED_SEARCHES = [
  { label: 'Smart Bus Tracking & Routes', desc: 'Transportation, Madurai route delays, and GPS prototype' },
  { label: 'PyTorch Edge AI Lab Projects', desc: 'Hardware sensors, computer vision, and SIT lab inspection' },
  { label: 'TechFest 2026 Hackathon Teams', desc: 'Inter-departmental recruitment and mentor matching' },
  { label: 'Hostel Wi-Fi & Network Bottlenecks', desc: 'Infrastructure feedback and speed optimization' },
  { label: 'Internship & Placement Advice', desc: 'Third and final year preparation, interview experiences' },
  { label: 'Embedded C & IoT Sensors', desc: 'Microcontrollers, lab enclosures, and circuit design' }
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [queryInput, setQueryInput] = useState(q);
  const [results, setResults] = useState<any>({ posts: [], communities: [], users: [] });
  const [isLoading, setIsLoading] = useState(false);

  const executeSearch = async (term: string) => {
    if (!term.trim()) return;
    setIsLoading(true);
    try {
      const res = await request<any>(`/search?q=${encodeURIComponent(term.trim())}`);
      setResults(res);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (q) {
      setQueryInput(q);
      executeSearch(q);
    }
  }, [q]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      setSearchParams({ q: queryInput.trim() });
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQueryInput(suggestion);
    setSearchParams({ q: suggestion });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Search className="h-5 w-5 text-indigo-400" />
          <span>Semantic Vector Search</span>
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Retrieves semantically related discussions, projects, and peers even without exact keyword matches
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="e.g. students struggling with internships, PyTorch lab models, bus timings..."
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          className="w-full rounded-2xl bg-[#111827] border border-[#1F2937] py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 shadow-xl"
        />
      </form>

      {/* Suggested Topics when query is empty */}
      {!q && !isLoading && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <Compass className="h-4 w-4 text-indigo-400" />
            <span>Popular Campus Search Topics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUGGESTED_SEARCHES.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSuggestion(item.label)}
                className="text-left rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/50 p-4 transition-all group hover:bg-[#151d30]"
              >
                <div className="flex items-center justify-between text-sm font-bold text-white group-hover:text-indigo-300">
                  <span>{item.label}</span>
                  <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="py-12 text-center text-xs text-gray-400">
          <Sparkles className="h-6 w-6 animate-spin mx-auto text-indigo-400 mb-2" />
          <span>Computing cosine vector similarity across SIT discussions...</span>
        </div>
      )}

      {!isLoading && q && (
        <div className="space-y-6">
          {/* Matching Communities */}
          {results.communities && results.communities.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-indigo-400" />
                <span>Matching Communities</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.communities.map((c: any) => (
                  <Link
                    key={c.id}
                    to={`/c/${c.slug}`}
                    className="rounded-2xl bg-[#111827] border border-[#1F2937] p-3 flex items-center gap-3 hover:border-gray-600 transition-colors"
                  >
                    <span className="text-2xl">{c.icon_url || '🏛️'}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{c.name}</div>
                      <div className="text-[10px] text-indigo-400">/c/{c.slug} • {c.member_count} members</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Matching Posts via Vector Search */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-purple-400" />
              <span>Semantic Discussion Results ({results.posts?.length || 0})</span>
            </h2>

            {results.posts && results.posts.length > 0 ? (
              results.posts.map((post: any) => (
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="block rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/50 p-4 transition-all"
                >
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                    <span className="font-semibold text-indigo-400">/c/{post.metadata?.community || 'general'}</span>
                    <span className="rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold">
                      {Math.round(post.similarityScore * 100)}% Semantic Match
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{post.title}</h3>
                  <p className="mt-1 text-xs text-gray-400 line-clamp-2 leading-relaxed">{post.content}</p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-8 text-center space-y-3">
                <Search className="h-8 w-8 text-gray-600 mx-auto" />
                <div>
                  <p className="text-xs text-gray-300 font-semibold">No discussions matched "{q}".</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Try searching for broader campus terms or ask Ask Sethu AI.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {SUGGESTED_SEARCHES.slice(0, 3).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSuggestion(item.label)}
                      className="rounded-xl bg-[#1F2937] hover:bg-gray-700 text-indigo-300 text-xs px-3 py-1.5 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
