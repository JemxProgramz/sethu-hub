import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { request } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.js';
import {
  Flame,
  Trophy,
  GraduationCap,
  Shield,
  Briefcase,
  Bookmark,
  MessageSquare,
  Sparkles,
  Calendar,
  Edit3,
  Plus,
  X,
  CheckCircle2,
  Compass
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<any | null>(null);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [isLoading, setIsLoading] = useState(true);

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editDepartment, setEditDepartment] = useState('CSD');
  const [editYear, setEditYear] = useState<number>(3);
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [editInterests, setEditInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadProfile = async () => {
    if (!username) return;
    setIsLoading(true);
    try {
      const res = await request<{ profile: any }>(`/users/${username}`);
      setProfile(res.profile);

      // Pre-fill edit state
      setEditDisplayName(res.profile.displayName || '');
      setEditBio(res.profile.bio || '');
      setEditDepartment(res.profile.department || 'CSD');
      setEditYear(res.profile.year || 3);
      setEditSkills(res.profile.skills || []);
      setEditInterests(res.profile.interests || []);

      // If viewing self, load saved posts
      if (currentUser && (currentUser.username === username || currentUser.role === 'admin')) {
        const savedRes = await request<{ savedPosts: any[] }>(`/users/${username}/saved`);
        setSavedPosts(savedRes.savedPosts);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [username, currentUser]);

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = skillInput.trim();
    if (clean && !editSkills.includes(clean)) {
      setEditSkills([...editSkills, clean]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditSkills(editSkills.filter(s => s !== skillToRemove));
  };

  const handleAddInterest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = interestInput.trim();
    if (clean && !editInterests.includes(clean)) {
      setEditInterests([...editInterests, clean]);
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setEditInterests(editInterests.filter(i => i !== interestToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      await request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          displayName: editDisplayName.trim(),
          bio: editBio.trim(),
          department: editDepartment,
          year: Number(editYear),
          skills: editSkills,
          interests: editInterests
        })
      });

      setSaveSuccess('Profile updated successfully!');
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSaveSuccess(null);
      }, 1200);
      await loadProfile();
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-xs text-[#888]">Loading user profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-12 text-xs text-[#888]">User not found.</div>;
  }

  const isSelf = currentUser?.username === profile.username;

  return (
    <div className="space-y-6">
      {/* Profile Banner & Header Card */}
      <div className="rounded-sm bg-[#0A0A0A] border border-[#222] p-6 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={profile.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`}
              alt="Avatar"
              className="h-20 w-20 rounded-sm bg-[#111] border-2 border-[#444] object-cover shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-white">{profile.displayName}</h1>
                {profile.role === 'faculty' && (
                  <span className="flex items-center gap-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>Verified Faculty</span>
                  </span>
                )}
                {profile.role === 'moderator' && (
                  <span className="flex items-center gap-1 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold">
                    <Shield className="h-3.5 w-3.5" />
                    <span>SIT Moderator</span>
                  </span>
                )}
              </div>
              <div className="text-xs text-[#888] font-medium mt-0.5">
                @{profile.username} • {profile.department} {profile.year ? `• Year ${profile.year}` : ''}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-sm bg-[#050505] border border-[#222] px-4 py-2">
              <Flame className="h-5 w-5 text-amber-400" />
              <div>
                <div className="text-xs font-semibold text-white">{profile.reputation}</div>
                <div className="text-[10px] text-[#888] uppercase tracking-wider font-semibold">Reputation</div>
              </div>
            </div>

            {isSelf && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-1.5 rounded-sm bg-[#1F2937] hover:bg-gray-700 text-gray-200 px-3.5 py-2 text-xs font-semibold border border-gray-700 transition-colors shadow-sm"
              >
                <Edit3 className="h-3.5 w-3.5 text-[#EDEDED]" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs text-gray-300 leading-relaxed bg-[#050505] rounded-sm p-3 border border-[#222]">
            {profile.bio}
          </p>
        )}

        {/* Skills & Interests Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#888] block mb-1.5">
              Verified Skills:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills?.length > 0 ? (
                profile.skills.map((sk: string, i: number) => (
                  <span key={i} className="rounded-lg bg-[#111] text-[#EDEDED] border border-[#333] px-2 py-0.5 text-xs font-semibold">
                    {sk}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#666] italic">No skills added yet</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#888] block mb-1.5">
              Interests & Domains:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests?.length > 0 ? (
                profile.interests.map((int: string, i: number) => (
                  <span key={i} className="rounded-lg bg-[#111] text-[#888] border border-[#333] px-2 py-0.5 text-xs font-semibold">
                    {int}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#666] italic">No interests added yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Badges Showcase */}
        {profile.badges && profile.badges.length > 0 && (
          <div className="pt-3 border-t border-[#222]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-2 flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5" />
              <span>Earned Sethu Badges ({profile.badges.length}):</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((b: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-sm bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs text-amber-300 flex items-center gap-1.5"
                  title={b.description}
                >
                  <Trophy className="h-3.5 w-3.5 text-amber-400" />
                  <span className="font-bold">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile Activity Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#222] pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === 'posts' ? 'border-[#444] text-white' : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            Discussions & Projects ({profile.recentPosts?.length || 0})
          </button>
          {isSelf && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'saved' ? 'border-[#444] text-white' : 'border-transparent text-[#888] hover:text-white'
              }`}
            >
              Saved Posts ({savedPosts.length})
            </button>
          )}
        </div>

        {activeTab === 'posts' && (
          <div className="space-y-3">
            {profile.recentPosts?.length === 0 ? (
              <div className="rounded-sm bg-[#0A0A0A] border border-[#222] p-8 text-center space-y-3">
                <MessageSquare className="h-8 w-8 text-gray-600 mx-auto" />
                <div>
                  <p className="text-xs text-gray-300 font-semibold">No discussions or projects published yet.</p>
                  <p className="text-[11px] text-[#666] mt-0.5">Start an institutional thread or recruit a team for your prototype.</p>
                </div>
                {isSelf && (
                  <Link
                    to="/create"
                    className="inline-flex items-center gap-1.5 rounded-sm bg-[#EDEDED] text-black hover:bg-white px-4 py-2 text-xs font-bold text-white shadow-lg  transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create Your First Post</span>
                  </Link>
                )}
              </div>
            ) : (
              profile.recentPosts.map((p: any) => (
                <Link
                  key={p.id}
                  to={`/post/${p.id}`}
                  className="block rounded-sm bg-[#0A0A0A] border border-[#222] p-4 hover:border-[#444] transition-all"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#888] mb-1">
                    <span className="font-semibold text-[#EDEDED]">/c/{p.community_slug}</span>
                    <span>{new Date(p.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{p.title}</h3>
                  <div className="mt-2 text-[11px] text-[#888] flex items-center gap-3">
                    <span>{p.upvotes_count} upvotes</span>
                    <span>•</span>
                    <span>{p.comments_count} comments</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-3">
            {savedPosts.length === 0 ? (
              <div className="rounded-sm bg-[#0A0A0A] border border-[#222] p-8 text-center space-y-3">
                <Bookmark className="h-8 w-8 text-gray-600 mx-auto" />
                <div>
                  <p className="text-xs text-gray-300 font-semibold">No saved discussions yet.</p>
                  <p className="text-[11px] text-[#666] mt-0.5">Bookmark useful technical solutions, research threads, or campus notices.</p>
                </div>
                <Link
                  to="/home"
                  className="inline-flex items-center gap-1.5 rounded-sm bg-[#1F2937] hover:bg-gray-700 px-4 py-2 text-xs font-bold text-gray-200 transition-all"
                >
                  <Compass className="h-3.5 w-3.5 text-[#EDEDED]" />
                  <span>Browse Campus Feed</span>
                </Link>
              </div>
            ) : (
              savedPosts.map((sp: any) => (
                <Link
                  key={sp.id}
                  to={`/post/${sp.id}`}
                  className="block rounded-sm bg-[#0A0A0A] border border-[#222] p-4 hover:border-[#444] transition-all"
                >
                  <div className="text-[11px] text-[#EDEDED] font-semibold mb-1">/c/{sp.community_slug}</div>
                  <h3 className="text-sm font-bold text-white">{sp.title}</h3>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal Drawer */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-sm bg-[#0A0A0A] border border-[#222] p-6 shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#222]">
              <div>
                <h3 className="text-base font-bold text-white">Edit SIT Profile</h3>
                <p className="text-[11px] text-[#888]">Update your verified academic department, skills, and bio</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-lg p-1 text-[#888] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {saveSuccess && (
              <div className="rounded-sm bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{saveSuccess}</span>
              </div>
            )}

            {saveError && (
              <div className="rounded-sm bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
                {saveError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Display Name</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  required
                  className="w-full rounded-sm bg-[#050505] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#444]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Department</label>
                  <select
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full rounded-sm bg-[#050505] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#444]"
                  >
                    <option value="CSD">CSD (Computer Science & Design)</option>
                    <option value="AI_DS">AI & Data Science</option>
                    <option value="CSE">CSE (Computer Science)</option>
                    <option value="IT">IT (Information Technology)</option>
                    <option value="ECE">ECE (Electronics & Comm)</option>
                    <option value="EEE">EEE (Electrical & Electronics)</option>
                    <option value="MECH">Mechanical Engineering</option>
                    <option value="CIVIL">Civil Engineering</option>
                    <option value="BIOTECH">BioTechnology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Academic Year</label>
                  <select
                    value={editYear}
                    onChange={(e) => setEditYear(Number(e.target.value))}
                    className="w-full rounded-sm bg-[#050505] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#444]"
                  >
                    <option value={1}>Year 1</option>
                    <option value={2}>Year 2</option>
                    <option value={3}>Year 3</option>
                    <option value={4}>Year 4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Bio / Profile Summary</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Share your focus area, projects you're working on, or research interests..."
                  className="w-full rounded-sm bg-[#050505] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#444]"
                />
              </div>

              {/* Skills Tag Input */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Verified Technical Skills</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. PyTorch, React, Embedded C, ROS..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                    className="flex-1 rounded-sm bg-[#050505] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#444]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    className="rounded-sm bg-[#1F2937] hover:bg-gray-700 px-3 py-2 text-white font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {editSkills.map((sk) => (
                    <span
                      key={sk}
                      className="rounded-lg bg-[#111] text-[#EDEDED] border border-[#333] px-2 py-0.5 text-xs flex items-center gap-1"
                    >
                      <span>{sk}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sk)}
                        className="text-[#EDEDED] hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests Tag Input */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Domains & Interests</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Robotics, Computer Vision, Hackathons, UI/UX..."
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddInterest(); } }}
                    className="flex-1 rounded-sm bg-[#050505] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#444]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddInterest()}
                    className="rounded-sm bg-[#1F2937] hover:bg-gray-700 px-3 py-2 text-white font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {editInterests.map((int) => (
                    <span
                      key={int}
                      className="rounded-lg bg-[#111] text-[#888] border border-[#333] px-2 py-0.5 text-xs flex items-center gap-1"
                    >
                      <span>{int}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(int)}
                        className="text-[#888] hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-sm text-[#888] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-sm bg-[#EDEDED] text-black hover:bg-white disabled:opacity-50 px-5 py-2 font-bold text-white shadow-lg "
                >
                  {isSaving ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
