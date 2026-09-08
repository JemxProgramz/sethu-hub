import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiService, TrendItem } from '../services/aiService.js';
import { TrendingUp, Sparkles, Flame, Users, MessageSquare, ArrowRight } from 'lucide-react';

export const TrendingPage: React.FC = () => {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    aiService.getTrends()
      .then(res => setTrends(res.trends))
      .catch(err => console.error('Trends error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-400" />
            <span>Agent 5: AI Campus Trend Detector</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Continuously tracking topic velocity, post volume spikes, and emerging discussions across Sethu Institute of Technology
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-400">Analyzing platform-wide signals...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trends.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-amber-500/40 transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {t.velocity}
                  </span>
                  <div className="text-sm font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    +{t.growth_percent}% this week
                  </div>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {t.topic}
                </h3>

                <p className="mt-2 text-xs text-gray-300 leading-relaxed">
                  {t.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1F2937] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5 text-gray-500" />
                    <span>{t.post_count} active posts</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-gray-500" />
                    <span>{t.user_count} contributing students</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-500">Related Hubs:</span>
                  {t.related_communities?.map((comm, idx) => (
                    <Link
                      key={idx}
                      to={`/c/${comm}`}
                      className="rounded bg-[#0B0F19] text-indigo-400 hover:text-white border border-[#1F2937] px-1.5 py-0.5 text-[10px] font-semibold transition-colors"
                    >
                      /c/{comm}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

