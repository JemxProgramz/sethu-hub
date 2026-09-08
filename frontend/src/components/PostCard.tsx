import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PostItem, postService } from '../services/postService.js';
import { useAuth } from '../hooks/useAuth.js';
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Bookmark,
  Share2,
  Flag,
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  GraduationCap,
  Shield,
  Layers,
  Vote,
  ExternalLink
} from 'lucide-react';

interface PostCardProps {
  post: PostItem;
  onPostUpdated?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdated }) => {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = useState(post.upvotes_count);
  const [downvotes, setDownvotes] = useState(post.downvotes_count);
  const [userVote, setUserVote] = useState(post.user_vote || 0);
  const [isSaved, setIsSaved] = useState(post.is_saved || false);
  const [isVoting, setIsVoting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Poll voting state
  const [selectedOption, setSelectedOption] = useState<string | null>(post.poll_data?.userVotedOptionId || null);
  const [pollOptions, setPollOptions] = useState(post.poll_data?.options || []);

  // Event RSVP state
  const [isRsvpd, setIsRsvpd] = useState(post.event_data?.isRsvpd || false);
  const [rsvpCount, setRsvpCount] = useState(post.event_data?.rsvp_count || 0);

  const handleVote = async (direction: 1 | -1) => {
    if (!user) return;
    if (isVoting) return;

    setIsVoting(true);
    const newVote = userVote === direction ? 0 : direction;

    // Optimistic calculation
    if (newVote === 1) {
      setUpvotes(prev => prev + 1);
      if (userVote === -1) setDownvotes(prev => Math.max(0, prev - 1));
    } else if (newVote === -1) {
      setDownvotes(prev => prev + 1);
      if (userVote === 1) setUpvotes(prev => Math.max(0, prev - 1));
    } else {
      if (userVote === 1) setUpvotes(prev => Math.max(0, prev - 1));
      if (userVote === -1) setDownvotes(prev => Math.max(0, prev - 1));
    }
    setUserVote(newVote);

    try {
      const res = await postService.votePost(post.id, newVote);
      setUpvotes(res.upvotesCount);
      setDownvotes(res.downvotesCount);
      setUserVote(res.userVote);
    } catch (err) {
      // Revert on error
      setUpvotes(post.upvotes_count);
      setDownvotes(post.downvotes_count);
      setUserVote(post.user_vote || 0);
    } finally {
      setIsVoting(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const res = await postService.toggleSave(post.id);
      setIsSaved(res.isSaved);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePollVote = async (optionId: string) => {
    if (!user || !post.poll_data) return;
    try {
      await postService.votePoll(post.poll_data.id, optionId);
      setSelectedOption(optionId);
      if (onPostUpdated) onPostUpdated();
    } catch (err) {
      console.error('Poll vote failed:', err);
    }
  };

  const handleEventRsvp = async () => {
    if (!user || !post.event_data) return;
    try {
      const res = await postService.rsvpEvent(post.event_data.id);
      setIsRsvpd(res.isRsvpd);
      setRsvpCount(res.rsvpCount);
    } catch (err) {
      console.error('RSVP failed:', err);
    }
  };

  // Post type styling
  const getTypeBadge = () => {
    switch (post.post_type) {
      case 'question':
        return { label: 'Question', bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'project':
        return { label: 'Project', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'opportunity':
        return { label: 'Opportunity', bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'event':
        return { label: 'Event', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'announcement':
        return { label: 'Announcement', bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
      case 'poll':
        return { label: 'Poll', bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
      case 'showcase':
        return { label: 'Showcase', bg: 'bg-pink-500/15 text-pink-300 border-pink-500/30' };
      default:
        return { label: 'Discussion', bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
    }
  };

  const badge = getTypeBadge();
  const netScore = upvotes - downvotes;

  return (
    <article className="group rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-indigo-500/40 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-950/20 p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Voting Pillar */}
        <div className="flex flex-col items-center rounded-xl bg-[#182234] border border-[#2D3748] p-1 sm:p-1.5 flex-shrink-0">
          <button
            onClick={() => handleVote(1)}
            className={`rounded-lg p-1 transition-colors ${
              userVote === 1 ? 'text-indigo-400 bg-indigo-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Upvote"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <span className={`text-xs font-extrabold my-0.5 ${netScore > 0 ? 'text-indigo-300' : netScore < 0 ? 'text-rose-400' : 'text-gray-400'}`}>
            {netScore}
          </span>
          <button
            onClick={() => handleVote(-1)}
            className={`rounded-lg p-1 transition-colors ${
              userVote === -1 ? 'text-rose-400 bg-rose-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Downvote"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-2">
            <Link
              to={`/c/${post.community_slug}`}
              className="font-bold text-white hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <span>{post.community_icon || '🏛️'}</span>
              <span>/c/{post.community_slug}</span>
            </Link>

            <span>•</span>

            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${badge.bg}`}>
              {badge.label}
            </span>

            <span>•</span>

            <div className="flex items-center gap-1.5">
              <Link to={`/user/${post.author_username}`} className="font-semibold text-gray-200 hover:text-white flex items-center gap-1">
                <span>{post.author_display_name || post.author_username}</span>
                {post.author_role === 'faculty' && (
                  <span title="Verified SIT Faculty">
                    <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
                  </span>
                )}
                {post.author_role === 'moderator' && (
                  <span title="Community Moderator">
                    <Shield className="h-3.5 w-3.5 text-amber-400" />
                  </span>
                )}
              </Link>
              {post.author_dept && (
                <span className="text-[11px] text-gray-400">({post.author_dept})</span>
              )}
            </div>
          </div>

          {/* Title */}
          <Link to={`/post/${post.id}`}>
            <h2 className="text-base sm:text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors leading-snug">
              {post.title}
            </h2>
          </Link>

          {/* Content Excerpt */}
          <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3">
            {post.content}
          </p>

          {/* Post-Type Specific UI Elements */}
          {/* Project Specifics */}
          {post.post_type === 'project' && post.project_data && (
            <div className="mt-3 rounded-xl bg-[#182234] border border-[#2D3748] p-3 text-xs">
              <div className="flex items-center justify-between text-gray-300 font-semibold mb-1.5">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Users className="h-3.5 w-3.5" />
                  <span>Team Recruitment ({post.project_data.status})</span>
                </span>
                <span className="text-[10px] text-gray-400">Team Size: {post.project_data.team_size}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-gray-400 text-[11px]">Required:</span>
                {post.project_data.required_skills?.map((skill: string, i: number) => (
                  <span key={i} className="rounded bg-emerald-500/10 text-emerald-300 text-[10px] px-1.5 py-0.5 border border-emerald-500/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Poll Specifics */}
          {post.post_type === 'poll' && post.poll_data && (
            <div className="mt-3 rounded-xl bg-[#182234] border border-[#2D3748] p-3 space-y-2">
              <div className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                <Vote className="h-4 w-4 text-indigo-400" />
                <span>Cast your vote:</span>
              </div>
              {pollOptions.map((opt: any) => {
                const totalVotes = pollOptions.reduce((acc: number, o: any) => acc + o.vote_count, 0) || 1;
                const percent = Math.round((opt.vote_count / totalVotes) * 100);
                const isSelected = selectedOption === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handlePollVote(opt.id)}
                    className={`w-full relative overflow-hidden rounded-lg border p-2 text-left text-xs transition-all ${
                      isSelected ? 'border-indigo-500 bg-indigo-950/40 text-white' : 'border-[#1F2937] hover:border-gray-600 text-gray-300'
                    }`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-indigo-600/20 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                    <div className="relative flex items-center justify-between z-10">
                      <span className="font-medium">{opt.option_text}</span>
                      <span className="font-bold text-gray-400">{percent}% ({opt.vote_count})</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Event Specifics */}
          {post.post_type === 'event' && post.event_data && (
            <div className="mt-3 rounded-xl bg-[#182234] border border-[#2D3748] p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 text-gray-300">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Calendar className="h-4 w-4" />
                  <span>{post.event_data.event_date} @ {post.event_data.event_time}</span>
                </span>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{post.event_data.location}</span>
                </span>
              </div>
              <button
                onClick={handleEventRsvp}
                className={`rounded-xl px-3 py-1.5 font-bold transition-colors ${
                  isRsvpd ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isRsvpd ? `✓ Going (${rsvpCount})` : `RSVP (${rsvpCount})`}
              </button>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              {post.tags.map((tag, i) => (
                <Link
                  key={i}
                  to={`/search?q=${encodeURIComponent(tag)}`}
                  className="rounded-md bg-[#182234] hover:bg-[#1f2d45] border border-[#1F2937] px-2 py-0.5 text-[11px] text-gray-400 hover:text-indigo-300 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* AI Intelligence Badge */}
          {post.ai_analysis && (
            <div className="mt-3 flex items-center gap-2 text-[11px] text-indigo-300 bg-indigo-950/30 border border-indigo-500/20 rounded-lg px-2.5 py-1 w-fit">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span>AI Insights: {post.ai_analysis.topic}</span>
              {post.ai_analysis.collaboration_potential && (
                <span className="text-emerald-400 font-bold">• High Collaboration Match</span>
              )}
            </div>
          )}

          {/* Action Bar */}
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-[#1F2937]">
            <Link
              to={`/post/${post.id}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments_count} Comments</span>
            </Link>

            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 transition-colors ${
                isSaved ? 'text-indigo-400' : 'hover:text-white'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>{copied ? 'Copied Link!' : 'Share'}</span>
            </button>

            {post.is_accepted_answer_set === 1 && (
              <span className="ml-auto flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Solution Accepted</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
