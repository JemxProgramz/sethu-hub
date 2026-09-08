import React, { useEffect, useState } from 'react';
import { request } from '../services/api.js';
import { Shield, AlertTriangle, CheckCircle, Trash2, UserX, AlertCircle } from 'lucide-react';

export const ModeratorPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [aiFlags, setAiFlags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadQueue = async () => {
    setIsLoading(true);
    try {
      const res = await request<any>('/moderator/queue');
      setReports(res.reports);
      setAiFlags(res.aiFlags);
    } catch (err: any) {
      console.error('Moderator queue error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleAction = async (targetType: string, targetId: string, action: string, flagId?: string, reportId?: string) => {
    try {
      await request('/moderator/action', {
        method: 'POST',
        body: JSON.stringify({
          targetType,
          targetId,
          action,
          flagId,
          reportId,
          notes: `Action ${action} executed from moderator dashboard.`
        })
      });
      setActionSuccess(`Enforcement action "${action}" completed.`);
      setTimeout(() => setActionSuccess(null), 3000);
      await loadQueue();
    } catch (err: any) {
      alert(err.message || 'Moderation action failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Human-in-the-loop Advisory Queue
          </span>
          <span className="text-xs text-gray-400">Agent 4: AI Moderator Screening</span>
        </div>
        <h1 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-400" />
          <span>Moderation Review Queue</span>
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          AI screens content and calculates risk scores; final enforcement decisions remain strictly with authorized human moderators.
        </p>
      </div>

      {actionSuccess && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading moderation queue...</div>
      ) : (
        <div className="space-y-6">
          {/* AI Safety Flags */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              <span>AI Safety Flags Pending Review ({aiFlags.length})</span>
            </h2>

            {aiFlags.length === 0 ? (
              <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-8 text-center text-xs text-gray-400">
                No active AI safety flags. All content cleared!
              </div>
            ) : (
              aiFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="rounded-2xl bg-[#111827] border border-amber-500/30 p-5 space-y-3 shadow-xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold">
                        Category: {flag.category}
                      </span>
                      <span className="text-xs text-gray-400">Target ID: {flag.target_id}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-amber-400 font-bold">Risk Score: {Math.round(flag.risk_score * 100)}%</span>
                      <span className="text-gray-400">• Confidence: {Math.round(flag.confidence * 100)}%</span>
                    </div>
                  </div>

                  {/* AI Reasoning */}
                  <div className="rounded-xl bg-[#0B0F19] border border-[#1F2937] p-3 text-xs">
                    <span className="font-bold text-indigo-300">AI Flag Explanation: </span>
                    <span className="text-gray-300">{flag.reasoning}</span>
                  </div>

                  {/* Content Preview */}
                  {flag.post_title && (
                    <div className="text-xs text-gray-400">
                      <span className="font-semibold text-white">Post Title: </span>
                      <span>"{flag.post_title}"</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-[#1F2937] flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => handleAction(flag.target_type, flag.target_id, 'dismiss', flag.id)}
                      className="rounded-xl bg-[#182234] hover:bg-[#2D3748] text-gray-200 border border-[#2D3748] px-3.5 py-1.5 font-bold transition-colors"
                    >
                      Approve & Dismiss Flag
                    </button>

                    <button
                      onClick={() => handleAction(flag.target_type, flag.target_id, 'warn', flag.id)}
                      className="rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 font-bold transition-colors"
                    >
                      Issue Warning
                    </button>

                    <button
                      onClick={() => handleAction(flag.target_type, flag.target_id, 'remove', flag.id)}
                      className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-1.5 font-bold transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove Content</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

