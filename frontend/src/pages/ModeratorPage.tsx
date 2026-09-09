import React, { useEffect, useState } from 'react';
import { request } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';
import { Shield, AlertTriangle, CheckCircle, Trash2, MessageSquare, Lock } from 'lucide-react';

export const ModeratorPage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [aiFlags, setAiFlags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadQueue = async () => {
    setIsLoading(true);
    try {
      const res = await request<any>('/moderator/queue');
      setReports(res.reports || []);
      setAiFlags(res.aiFlags || []);
    } catch (err: any) {
      console.error('Moderator queue error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && ['moderator', 'admin'].includes(user.role)) {
      loadQueue();
    } else {
      setIsLoading(false);
    }
  }, [user]);

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

  if (!user || !['moderator', 'admin'].includes(user.role)) {
    return (
      <div className="rounded-sm bg-[#0A0A0A] border border-[#222] p-12 text-center space-y-4 max-w-lg mx-auto mt-8">
        <Lock className="h-10 w-10 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Moderator Access Required</h2>
        <p className="text-xs text-[#888]">
          This portal is restricted to authorized Sethu Institute of Technology moderators and administrators. Switch to a Moderator or Admin persona using the top navigation persona menu to access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Human-in-the-loop Advisory Queue
          </span>
          <span className="text-xs text-[#888]">Moderation Queue</span>
        </div>
        <h1 className="text-xl font-semibold text-white mt-1 flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-400" />
          <span>Moderation Review Queue</span>
        </h1>
        <p className="text-xs text-[#888] mt-0.5">
          AI screens content and calculates risk scores; final enforcement decisions remain strictly with authorized human moderators.
        </p>
      </div>

      {actionSuccess && (
        <div className="rounded-sm bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-[#888]">Loading moderation queue...</div>
      ) : (
        <div className="space-y-8">
          {/* User Incident Reports */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              <span>Student & Faculty Reports ({reports.length})</span>
            </h2>

            {reports.length === 0 ? (
              <div className="rounded-sm bg-[#0A0A0A] border border-[#222] p-6 text-center text-xs text-[#888]">
                No user-submitted incident reports pending.
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="rounded-sm bg-[#0A0A0A] border border-rose-500/30 p-5 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-300">Reason: {report.reason}</span>
                    <span className="text-[#888]">Reported by @{report.reporter_username || 'anonymous'}</span>
                  </div>
                  <div className="rounded-sm bg-[#050505] p-3 text-xs text-gray-300 border border-[#222]">
                    <span className="font-semibold text-[#888]">Target Content ({report.target_type}): </span>
                    <span>"{report.target_content || report.details || report.target_id}"</span>
                  </div>
                  <div className="flex justify-end gap-2 text-xs">
                    <button
                      onClick={() => handleAction(report.target_type, report.target_id, 'dismiss', undefined, report.id)}
                      className="rounded-sm bg-[#111] hover:bg-[#2D3748] text-gray-200 border border-[#333] px-3.5 py-1.5 font-bold transition-colors"
                    >
                      Dismiss Report
                    </button>
                    <button
                      onClick={() => handleAction(report.target_type, report.target_id, 'remove', undefined, report.id)}
                      className="rounded-sm bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-1.5 font-bold transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove Content</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* AI Safety Flags */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              <span>AI Safety Flags Pending Review ({aiFlags.length})</span>
            </h2>

            {aiFlags.length === 0 ? (
              <div className="rounded-sm bg-[#0A0A0A] border border-[#222] p-8 text-center text-xs text-[#888]">
                No active AI safety flags. All content cleared!
              </div>
            ) : (
              aiFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="rounded-sm bg-[#0A0A0A] border border-amber-500/30 p-5 space-y-3 shadow-xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold">
                        Category: {flag.category}
                      </span>
                      <span className="text-xs text-[#888]">Target ID: {flag.target_id}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-amber-400 font-bold">Risk Score: {Math.round(flag.risk_score * 100)}%</span>
                      <span className="text-[#888]">• Confidence: {Math.round(flag.confidence * 100)}%</span>
                    </div>
                  </div>

                  <div className="rounded-sm bg-[#050505] border border-[#222] p-3 text-xs">
                    <span className="font-bold text-[#EDEDED]">AI Flag Explanation: </span>
                    <span className="text-gray-300">{flag.reasoning}</span>
                  </div>

                  {flag.post_title && (
                    <div className="text-xs text-[#888]">
                      <span className="font-semibold text-white">Post Title: </span>
                      <span>"{flag.post_title}"</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#222] flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => handleAction(flag.target_type, flag.target_id, 'dismiss', flag.id)}
                      className="rounded-sm bg-[#111] hover:bg-[#2D3748] text-gray-200 border border-[#333] px-3.5 py-1.5 font-bold transition-colors"
                    >
                      Approve & Dismiss Flag
                    </button>

                    <button
                      onClick={() => handleAction(flag.target_type, flag.target_id, 'warn', flag.id)}
                      className="rounded-sm bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 font-bold transition-colors"
                    >
                      Issue Warning
                    </button>

                    <button
                      onClick={() => handleAction(flag.target_type, flag.target_id, 'remove', flag.id)}
                      className="rounded-sm bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-1.5 font-bold transition-colors flex items-center gap-1"
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


