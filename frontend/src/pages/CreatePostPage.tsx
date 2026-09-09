import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityService, CommunityItem } from '../services/communityService.js';
import { postService } from '../services/postService.js';
import { useAuth } from '../hooks/useAuth.js';
import { Plus, X } from 'lucide-react';

const POST_TYPES = [
  { id: 'discussion', label: 'Discussion' },
  { id: 'question', label: 'Question' },
  { id: 'project', label: 'Project' },
  { id: 'opportunity', label: 'Opportunity' },
  { id: 'event', label: 'Event' },
  { id: 'poll', label: 'Poll' },
  { id: 'announcement', label: 'Announcement' },
  { id: 'showcase', label: 'Showcase' }
];

export const CreatePostPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [postType, setPostType] = useState('discussion');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [communitySlug, setCommunitySlug] = useState('general');
  const [communities, setCommunities] = useState<CommunityItem[]>([]);

  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const [problemStatement, setProblemStatement] = useState('');
  const [teamSize, setTeamSize] = useState(3);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    communityService.getCommunities()
      .then(res => setCommunities(res.communities))
      .catch(() => {});
  }, []);

  const handleAddTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
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
    <div className="max-w-2xl mx-auto pb-10">
      <div className="border-b border-[#222] pb-6 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">Create a post</h1>
        <p className="text-sm text-[#888]">Share something with your campus.</p>
      </div>

      {error && (
        <div className="rounded-sm bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-500 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Post Type */}
        <div>
          <label className="block text-xs font-medium text-[#888] mb-2">Type</label>
          <div className="flex flex-wrap gap-2">
            {POST_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setPostType(t.id)}
                className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
                  postType === t.id
                    ? 'bg-[#222] text-[#EDEDED] border-[#444]'
                    : 'bg-[#0A0A0A] text-[#888] border-[#222] hover:text-[#EDEDED] hover:border-[#444]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Community */}
        <div>
          <label className="block text-xs font-medium text-[#888] mb-1.5">Community</label>
          <select
            value={communitySlug}
            onChange={(e) => setCommunitySlug(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444] transition-colors appearance-none"
          >
            {communities.map((c) => (
              <option key={c.slug} value={c.slug}>
                /c/{c.slug} — {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-[#888] mb-1.5">Title</label>
          <input
            type="text"
            placeholder={postType === 'question' ? 'What do you need help with?' : 'Give your post a title'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-3 py-2 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#444] transition-colors"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-medium text-[#888] mb-1.5">Content</label>
          <textarea
            rows={6}
            placeholder="Write your post..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-3 py-2 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#444] transition-colors leading-relaxed"
          />
        </div>

        {/* Project fields */}
        {postType === 'project' && (
          <div className="space-y-4 p-4 border border-[#222] rounded-sm bg-[#050505]">
            <div>
              <label className="block text-xs font-medium text-[#888] mb-1.5">Problem statement</label>
              <input
                type="text"
                placeholder="What problem are you solving?"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#888] mb-1.5">Team size: {teamSize}</label>
              <input type="range" min={2} max={6} value={teamSize} onChange={(e) => setTeamSize(parseInt(e.target.value))} className="w-full" />
            </div>
          </div>
        )}

        {/* Poll fields */}
        {postType === 'poll' && (
          <div className="space-y-3 p-4 border border-[#222] rounded-sm bg-[#050505]">
            <label className="block text-xs font-medium text-[#888] mb-1.5">Poll options</label>
            {pollOptions.map((opt, i) => (
              <input
                key={i}
                type="text"
                value={opt}
                onChange={(e) => handlePollOptionChange(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444]"
              />
            ))}
            {pollOptions.length < 6 && (
              <button type="button" onClick={handleAddPollOption} className="text-xs text-[#888] hover:text-[#EDEDED] flex items-center gap-1 transition-colors">
                <Plus className="h-3 w-3" /> Add option
              </button>
            )}
          </div>
        )}

        {/* Event fields */}
        {postType === 'event' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-[#222] rounded-sm bg-[#050505]">
            <div>
              <label className="block text-xs font-medium text-[#888] mb-1.5">Date</label>
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#888] mb-1.5">Location</label>
              <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Where is this happening?" className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-3 py-2 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#444]" />
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-[#888] mb-1.5">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(tagInput); } }}
              className="flex-1 bg-[#0A0A0A] border border-[#222] rounded-sm px-3 py-2 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#444]"
            />
            <button
              type="button"
              onClick={() => handleAddTag(tagInput)}
              className="rounded-sm bg-[#111] border border-[#222] px-3 py-2 text-xs text-[#888] hover:text-[#EDEDED] transition-colors"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 bg-[#111] border border-[#222] px-2 py-0.5 text-xs text-[#EDEDED] rounded-sm">
                  #{tag}
                  <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} className="text-[#666] hover:text-[#EDEDED]">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#EDEDED] hover:bg-white text-black rounded-sm px-5 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};
