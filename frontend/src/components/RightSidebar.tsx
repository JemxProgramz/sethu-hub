import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiService, TrendItem } from '../services/aiService.js';
import { ArrowRight } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const [trends, setTrends] = useState<TrendItem[]>([]);

  useEffect(() => {
    aiService.getTrends()
      .then(res => setTrends(res.trends.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <aside className="w-72 flex-shrink-0 hidden xl:block sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pl-6 border-l border-[#111]">
      <div className="space-y-8">
        {/* Trending at Sethu */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-[#666] uppercase tracking-wider">
              Trending at Sethu
            </span>
            <Link to="/trending" className="text-xs text-[#888] hover:text-[#EDEDED] transition-colors flex items-center gap-1">
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {trends.length > 0 ? (
              trends.map((t) => (
                <div key={t.id}>
                  <div className="text-sm font-medium text-[#EDEDED] line-clamp-1 mb-1">
                    {t.topic}
                  </div>
                  <div className="text-xs text-[#666]">
                    {t.post_count} discussions
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-[#666]">Loading trends...</div>
            )}
          </div>
        </div>

        {/* Upcoming */}
        <div>
          <div className="mb-4">
            <span className="text-xs font-medium text-[#666] uppercase tracking-wider">
              Upcoming
            </span>
          </div>
          <Link to="/c/hackathons" className="block p-3 border border-[#222] rounded-sm bg-[#0A0A0A] hover:border-[#444] transition-colors">
            <div className="text-sm font-medium text-[#EDEDED] mb-1">SIT TechFest 2026</div>
            <div className="text-xs text-[#888] mb-2">Oct 15 · 24-hour hackathon</div>
            <div className="text-xs text-[#666]">Rs. 1,50,000 prizes · Smart Campus & IoT</div>
          </Link>
        </div>
      </div>
    </aside>
  );
};
