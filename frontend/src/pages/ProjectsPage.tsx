import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { request } from '../services/api.js';
import { aiService } from '../services/aiService.js';
import { useAuth } from '../hooks/useAuth.js';
import {
  Rocket,
  Users,
  Sparkles,
  ArrowRight,
  Send,
  CheckCircle2,
  X,
  Building2,
  GraduationCap
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const { id: paramId } = useParams<{ id?: string }>();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Apply modal
  const [selectedProjectForApply, setSelectedProjectForApply] = useState<any | null>(null);
  const [roleApplied, setRoleApplied] = useState('');
  const [applyMessage, setApplyMessage] = useState('');
  const [applySuccess, setApplySuccess] = useState<string | null>(null);

  // AI Team Matching Drawer
  const [matchedCandidates, setMatchedCandidates] = useState<any[] | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [activeMatchingProjectTitle, setActiveMatchingProjectTitle] = useState('');
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await request<{ projects: any[] }>('/projects');
      setProjects(res.projects);
    } catch (err) {
      console.error('Projects load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (paramId && projects.length > 0) {
      const targetProj = projects.find(p => p.id === paramId || p.postId === paramId);
      if (targetProj) {
        handleRunTeamMatch(targetProj);
        setTimeout(() => {
          const el = document.getElementById(`proj-${targetProj.id}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    }
  }, [paramId, projects]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForApply || !user) return;

    try {
      await request(`/projects/${selectedProjectForApply.id}/apply`, {
        method: 'POST',
        body: JSON.stringify({ roleApplied, message: applyMessage })
      });
      setApplySuccess('Your request to join has been submitted to the project lead.');
      setTimeout(() => {
        setSelectedProjectForApply(null);
        setApplySuccess(null);
        setRoleApplied('');
        setApplyMessage('');
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit application');
    }
  };

  const handleRunTeamMatch = async (project: any) => {
    setIsMatching(true);
    setActiveMatchingProjectTitle(project.title);
    setMatchedCandidates(null);
    try {
      const res = await aiService.getTeamMatch(project.id);
      setMatchedCandidates(res.candidates);
    } catch (err) {
      console.error('Team match error:', err);
    } finally {
      setIsMatching(false);
    }
  };

  const handleInviteCandidate = async (candidate: any) => {
    if (invitedUsers.includes(candidate.user_id)) return;
    setInvitedUsers((prev) => [...prev, candidate.user_id]);

    try {
      await request('/notifications', {
        method: 'POST',
        body: JSON.stringify({
          recipientId: candidate.user_id,
          type: 'team_invite',
          title: 'Project Collaboration Invitation',
          message: `You were AI-matched and invited to join: "${activeMatchingProjectTitle}"!`,
          link: `/projects/${paramId || 'proj-killer-demo'}`
        })
      });
    } catch {
      // Graceful fallback
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Rocket className="h-5 w-5 text-emerald-400" />
            <span>Project Collaboration Board</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Inter-departmental teamwork for Smart India Hackathons, SIT IEDC grants, and final year prototypes
          </p>
        </div>

        <Link
          to="/create"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Rocket className="h-4 w-4" />
          <span>Post a Project</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading active projects...</div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj) => {
            const isSelected = paramId === proj.id || paramId === proj.postId;
            return (
              <div
                key={proj.id}
                id={`proj-${proj.id}`}
                className={`rounded-2xl bg-[#111827] border transition-all p-5 ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-xl shadow-indigo-950/40'
                    : 'border-[#1F2937] hover:border-gray-700'
                }`}
              >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {proj.status}
                    </span>
                    <span className="text-[11px] text-gray-400">Team Size: {proj.teamSize}</span>
                  </div>

                  <Link to={`/post/${proj.postId}`} className="text-base font-bold text-white hover:text-indigo-400 transition-colors">
                    {proj.title}
                  </Link>

                  <p className="mt-1 text-xs text-gray-400">
                    Lead: <span className="text-gray-200 font-semibold">{proj.author.displayName}</span> ({proj.author.department})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunTeamMatch(proj)}
                    className="rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                    <span>AI Team Match</span>
                  </button>

                  <button
                    onClick={() => setSelectedProjectForApply(proj)}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 text-xs font-bold transition-all"
                  >
                    Request to Join
                  </button>
                </div>
              </div>

              {/* Problem statement */}
              <div className="mt-3 rounded-xl bg-[#0B0F19] border border-[#1F2937] p-3 text-xs">
                <span className="font-semibold text-gray-400 text-[11px]">Problem Statement: </span>
                <span className="text-gray-200">{proj.problemStatement}</span>
              </div>

              {/* Required skills */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-gray-400 mr-1">Required:</span>
                {proj.requiredSkills.map((s: string, idx: number) => (
                  <span key={idx} className="rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold">
                    {s}
                  </span>
                ))}
              </div>

              {/* Members roster */}
              <div className="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>Current Roster ({proj.members.length}):</span>
                  {proj.members.map((m: any, i: number) => (
                    <span key={i} className="text-gray-200 font-medium">
                      {m.display_name} ({m.role_name})
                    </span>
                  ))}
                </div>
                <Link to={`/post/${proj.postId}`} className="text-indigo-400 hover:underline flex items-center gap-1">
                  <span>View Full Thread</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* AI Team Match Results Modal */}
      {(isMatching || matchedCandidates !== null) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-3xl bg-[#111827] border border-purple-500/40 p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Agent 6: AI Team Matchmaking
                  </h3>
                  <p className="text-[11px] text-gray-400">Matching SIT students for "{activeMatchingProjectTitle}"</p>
                </div>
              </div>
              <button
                onClick={() => { setMatchedCandidates(null); setIsMatching(false); }}
                className="rounded-lg p-1 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isMatching ? (
              <div className="py-12 text-center text-xs text-purple-300 space-y-2">
                <Sparkles className="h-8 w-8 animate-spin mx-auto text-purple-400" />
                <p>Analyzing project requirements and querying verified student skills across SIT...</p>
              </div>
            ) : (
              <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {matchedCandidates && matchedCandidates.length > 0 ? (
                  matchedCandidates.map((c) => (
                    <div key={c.user_id} className="rounded-xl bg-[#0B0F19] border border-[#1F2937] p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={c.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${c.username}`}
                            alt={c.display_name}
                            className="h-8 w-8 rounded-lg bg-gray-800"
                          />
                          <div>
                            <div className="text-xs font-bold text-white">{c.display_name}</div>
                            <div className="text-[10px] text-gray-400">{c.department} • Year {c.year || 3}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                          <span className="text-xs font-bold text-emerald-400">{c.match_score}% Match</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-300 leading-relaxed bg-[#111827] rounded-lg p-2 border border-[#1F2937]">
                        <span className="font-semibold text-indigo-300">Why they match: </span>
                        <span>{c.match_rationale}</span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex flex-wrap gap-1 text-[10px]">
                          {c.matching_skills.map((s: string, idx: number) => (
                            <span key={idx} className="rounded bg-indigo-500/15 text-indigo-300 px-1.5 py-0.5 border border-indigo-500/20">
                              ✓ {s}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => handleInviteCandidate(c)}
                          disabled={invitedUsers.includes(c.user_id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                            invitedUsers.includes(c.user_id)
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          {invitedUsers.includes(c.user_id) ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Invited to Team</span>
                            </>
                          ) : (
                            <>
                              <Send className="h-3 w-3" />
                              <span>Invite Candidate</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-gray-400">
                    No matching student profiles found with specified skill filters.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {selectedProjectForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#111827] border border-[#1F2937] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
              <h3 className="text-sm font-bold text-white">Join Project Team</h3>
              <button
                onClick={() => setSelectedProjectForApply(null)}
                className="rounded-lg p-1 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {applySuccess ? (
              <div className="py-6 text-center space-y-2 text-xs text-emerald-400">
                <CheckCircle2 className="h-8 w-8 mx-auto" />
                <p className="font-bold">{applySuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Applying for Role</label>
                  <input
                    type="text"
                    placeholder="e.g. AI/ML Engineer, UI/UX Designer, Hardware Lead..."
                    value={roleApplied}
                    onChange={(e) => setRoleApplied(e.target.value)}
                    required
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F2937] p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Introduction & Relevant Skills</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly state your experience and why you'd like to collaborate..."
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F2937] p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProjectForApply(null)}
                    className="px-3 py-2 rounded-xl text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 font-bold text-white"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

