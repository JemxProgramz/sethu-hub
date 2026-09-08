import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityService, CommunityItem } from '../services/communityService.js';
import { postService } from '../services/postService.js';
import { useAuth } from '../hooks/useAuth.js';
import {
  MessageSquare,
  HelpCircle,
  Rocket,
  Briefcase,
  Calendar,
  Bell,
  Vote,
  Sparkles,
  Plus,
  X,
  Send
} from 'lucide-react';

const POST_TYPES = [
  { id: 'discussion', label: 'Discussion', icon: MessageSquare, desc: 'Open conversation & thoughts' },
  { id: 'question', label: 'Question', icon: HelpCircle, desc: 'Technical & academic Q&A' },
  { id: 'project', label: 'Project', icon: Rocket, desc: 'Team recruitment & collaboration' },
  { id: 'opportunity', label: 'Opportunity', icon: Briefcase, desc: 'Internships, jobs, hackathons' },
  { id: 'event', label: 'Event', icon: Calendar, desc: 'Campus symposiums & workshops' },
  { id: 'poll', label: 'Poll', icon: Vote, desc: 'Community voting & feedback' },
  { id: 'announcement', label: 'Announcement', icon: Bell, desc: 'Official club/department notices' },
  { id: 'showcase', label: 'Showcase', icon: Sparkles, desc: 'Student demos & prototypes' }
];

export const CreatePostPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [postType, setPostType] = useState('discussion');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [communitySlug, setCommunitySlug] = useState('general');
  const [communities, setCommunities] = useState<CommunityItem[]>([]);

  // Tags
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Post-type specific states
  const [problemStatement, setProblemStatement] = useState('');
  const [teamSize, setTeamSize] = useState(3);
  const [pollOptions, setPollOptions] = useState(['Option 1', 'Option 2']);
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('10:00 AM');
  const [eventLocation, setEventLocation] = useState('SIT Central Auditorium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    communityService.getCommunities()
      .then(res => setCommunities(res.communities))
      .catch(err => console.error('Failed to load communities:', err));
  }, []);

  const handleAddTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`]);
    }
  };

  const handlePollOptionChange = (index: number, val: string) => {
    const updated = [...pollOptions];
    updated[index] = val;
    setPollOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const metadata: Record<string, any> = {};
    if (postType === 'project') {
      metadata.problem_statement = problemStatement || title;
      metadata.team_size = teamSize;
      metadata.required_skills = tags;
      metadata.open_roles = [{ role: 'Collaborator', spots: 1 }];
    } else if (postType === 'poll') {
      metadata.poll_options = pollOptions.filter(o => o.trim().length > 0);
    } else if (postType === 'event') {
      metadata.event_name = title;
      metadata.event_date = eventDate || new Date().toISOString().split('T')[0];
      metadata.event_time = eventTime;
      metadata.location = eventLocation;
    }

    try {
      const res = await postService.createPost({
        communityId: communitySlug,
        title: title.trim(),
        content: content.trim(),
        postType,
        tags,
        metadata
      });

      navigate(`/post/${res.postId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to publish post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white">Create New Post</h1>
        <p className="text-xs text-gray-400 mt-0.5">Share discussions, start questions, or pitch collaboration projects</p>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Post Type Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {POST_TYPES.map((t) => {
          const Icon = t.icon;
          const isSelected = postType === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setPostType(t.id)}
              className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                  : 'bg-[#111827] border-[#1F2937] text-gray-400 hover:border-gray-600 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-4 w-4 ${isSelected ? 'text-indigo-400' : 'text-gray-400'}`} />
                <span className="text-xs font-bold">{t.label}</span>
              </div>
              <span className="text-[10px] text-gray-400 leading-tight">{t.desc}</span>
            </button>
          );
        })}
      </div>

      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-4 sm:p-5 space-y-4">
            {/* Target Community Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Target Community Hub
              </label>
              <select
                value={communitySlug}
                onChange={(e) => setCommunitySlug(e.target.value)}
                className="w-full rounded-xl bg-[#0B0F19] border border-[#1F2937] px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                {communities.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.icon_url || '🏛️'} /c/{c.slug} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Post Title
              </label>
              <input
                type="text"
                placeholder={postType === 'question' ? 'e.g. How do I optimize CUDA memory allocation on SIT GPU server?' : 'An engaging, specific title...'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl bg-[#0B0F19] border border-[#1F2937] px-3.5 py-2.5 text-sm font-semibold text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Body Content */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Content & Description
              </label>
              <textarea
                rows={6}
                placeholder="Share your technical context, project details, code snippets, or thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-xl bg-[#0B0F19] border border-[#1F2937] p-3.5 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Project Specific Fields */}
            {postType === 'project' && (
              <div className="p-4 rounded-xl bg-[#182234] border border-[#2D3748] space-y-3">
                <div className="text-xs font-bold text-emerald-400">Project Collaboration Fields</div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Problem Statement</label>
                  <input
                    type="text"
                    placeholder="Briefly state the institutional or real-world problem being addressed..."
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F2937] px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Target Team Size: {teamSize}</label>
                  <input
                    type="range"
                    min={2}
                    max={6}
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Poll Specific Fields */}
            {postType === 'poll' && (
              <div className="p-4 rounded-xl bg-[#182234] border border-[#2D3748] space-y-3">
                <div className="text-xs font-bold text-indigo-400">Poll Options</div>
                {pollOptions.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    value={opt}
                    onChange={(e) => handlePollOptionChange(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F2937] px-3 py-2 text-xs text-white focus:outline-none"
                  />
                ))}
                {pollOptions.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add another option
                  </button>
                )}
              </div>
            )}

            {/* Event Specific Fields */}
            {postType === 'event' && (
              <div className="p-4 rounded-xl bg-[#182234] border border-[#2D3748] grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F2937] px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Location / Venue</label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F2937] px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Tags Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Tags & Required Skills
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag and press Enter (e.g. Python, UI/UX, PyTorch)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(tagInput);
                    }
                  }}
                  className="flex-1 rounded-xl bg-[#0B0F19] border border-[#1F2937] px-3.5 py-2 text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(tagInput)}
                  className="rounded-xl bg-[#182234] border border-[#2D3748] px-3 py-2 text-xs font-bold text-gray-300 hover:text-white"
                >
                  Add Tag
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-300"
                    >
                      <span>#{tag}</span>
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Publishing...' : 'Publish Post'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

