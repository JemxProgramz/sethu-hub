import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiService, TrendItem } from '../services/aiService.js';
import { Sparkles, TrendingUp, Calendar, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const [trends, setTrends] = useState<TrendItem[]>([]);

  useEffect(() => {
    aiService.getTrends()
      .then(res => setTrends(res.trends.slice(0, 3)))
      .catch(err => console.error('[RIGHT_SIDEBAR] Trends error:', err));
  }, []);

  return (
    <aside className="w-80 flex-shrink-0 hidden xl:block sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pl-4">
      <div className="space-y-6">
        {/* AI Intelligence Pulse */}
        <div className="rounded-2xl bg-[#111827]/80 border border-[#1F2937] p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                AI Campus Pulse
              </span>
            </div>
            <Link to="/trending" className="text-[10px] text-indigo-400 hover:underline flex items-center gap-0.5">
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-3 space-y-3">
            {trends.length > 0 ? (
              trends.map((t) => (
                <div key={t.id} className="group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-semibold text-gray-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {t.topic}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
                      +{t.growth_percent}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                    <span>{t.post_count} discussions</span>
                    <span>•</span>
                    <span className="text-indigo-400 capitalize">{t.velocity}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-400 py-2">Analyzing campus discussions...</div>
            )}
          </div>
        </div>

        {/* Upcoming Campus Events Card */}
        <div className="rounded-2xl bg-[#111827]/80 border border-[#1F2937] p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Upcoming SIT Events
              </span>
            </div>
            <span className="text-[10px] text-gray-400">October 2026</span>
          </div>

          <div className="mt-3 space-y-3">
            <div className="rounded-xl bg-[#182234] p-3 border border-[#2D3748]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
                  24-Hour Hackathon
                </span>
                <span className="text-[10px] text-gray-400">Oct 15, 2026</span>
              </div>
              <div className="mt-1.5 text-xs font-bold text-white">SIT TechFest 2026 Hackfest</div>
              <p className="mt-1 text-[11px] text-gray-400">Rs. 1,50,000 cash prizes • Smart Campus & IoT tracks</p>
              <Link
                to="/c/hackathons"
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <span>View Event Details</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Top Contributors Leaderboard */}
        <div className="rounded-2xl bg-[#111827]/80 border border-[#1F2937] p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Top Contributors
              </span>
            </div>
            <span className="text-[10px] text-gray-400">This Week</span>
          </div>

          <div className="mt-3 space-y-2.5">
            {[
              { name: 'Dr. S. Ramanathan', dept: 'CSE Faculty', rep: '1250 Rep', badge: 'Verified Mentor', avatar: 'dr_ramanathan' },
              { name: 'Priyadharshini M.', dept: 'ECE 4th Year', rep: '890 Rep', badge: 'Club Lead', avatar: 'priya_mod' },
              { name: 'Sneha Murugan', dept: 'IT 4th Year', rep: '540 Rep', badge: 'Placement Guide', avatar: 'sneha_it' },
              { name: 'Karthik Raja', dept: 'CSD 3rd Year', rep: '420 Rep', badge: 'Project Builder', avatar: 'karthik_csd' }
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="text-[11px] font-bold text-gray-400 w-3">{i + 1}</div>
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${c.avatar}&backgroundColor=0f172a,1e1b4b`}
                    alt={c.name}
                    className="h-7 w-7 rounded-lg bg-gray-800"
                  />
                  <div>
                    <div className="font-semibold text-gray-200 line-clamp-1">{c.name}</div>
                    <div className="text-[10px] text-gray-400">{c.dept}</div>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-amber-400">{c.rep}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

