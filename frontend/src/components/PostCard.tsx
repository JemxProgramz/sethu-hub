import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PostItem, postService } from '../services/postService.js';
import { useAuth } from '../hooks/useAuth.js';
import {
  ChevronUp,
  MessageSquare,
  Bookmark,
  Share2,
  Calendar,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface PostCardProps {
  post: PostItem;
  onPostUpdated?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdated }) => {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = useState(post.upvotes_count);
  const [userVote, setUserVote] = useState(post.user_vote || 0);
  const [isSaved, setIsSaved] = useState(post.is_saved || false);
  const [isVoting, setIsVoting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Poll voting state
  const [selectedOption, setSelectedOption] = useState<string | null>(post.poll_data?.userVotedOptionId || null);

  // Event RSVP state
  const [isRsvpd, setIsRsvpd] = useState(post.event_data?.isRsvpd || false);
  const [rsvpCount, setRsvpCount] = useState(post.event_data?.rsvp_count || 0);

  const handleVote = async () => {
    if (!user) return;
    if (isVoting) return;

    setIsVoting(true);
    const newVote = userVote === 1 ? 0 : 1;

    // Optimistic calculation
    if (newVote === 1) {
      setUpvotes(prev => prev + 1);
    } else {
      setUpvotes(prev => Math.max(0, prev - 1));
    }
    setUserVote(newVote);

    try {
      const res = await postService.votePost(post.id, newVote);
      setUpvotes(res.upvotesCount);
      setUserVote(res.userVote);
    } catch (err) {
      // Revert on error
      setUpvotes(post.upvotes_count);
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

  const getTypeLabel = () => {
    switch (post.post_type) {
      case 'question': return 'Question';
      case 'project': return 'Project';
      case 'opportunity': return 'Opportunity';
      case 'event': return 'Event';
      case 'announcement': return 'Announcement';
      case 'poll': return 'Poll';
      case 'showcase': return 'Showcase';
      default: return 'Discussion';
    }
  };

  return (
    <article className="bg-[#0A0A0A] border border-[#222] rounded-sm p-4 sm:p-5 hover:border-[#444] transition-colors">
      <div className="flex items-start gap-4">
        {/* Voting Pillar */}
        <div className="flex flex-col items-center flex-shrink-0 pt-1">
          <button
            onClick={handleVote}
            className={`p-1.5 rounded-sm transition-colors ${
              userVote === 1 ? 'text-[#EDEDED] bg-[#222]' : 'text-[#666] hover:text-[#EDEDED] hover:bg-[#111]'
            }`}
          >
            <ChevronUp className="w-4 h-4 stroke-[3]" />
          </button>
          <span className={`text-xs font-medium mt-1 ${userVote === 1 ? 'text-[#EDEDED]' : 'text-[#888]'}`}>
            {upvotes}
          </span>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 text-xs text-[#888]">
            <Link to={`/c/${post.community_slug}`} className="font-medium text-[#EDEDED] hover:underline">
              c/{post.community_slug}
            </Link>
            <span>•</span>
            <span>Posted by {post.author_username}</span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <span className="uppercase tracking-wider text-[10px] bg-[#111] border border-[#222] px-1.5 py-0.5 rounded-sm">
              {getTypeLabel()}
            </span>
          </div>

          <Link to={`/post/${post.id}`} className="block group">
            <h2 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
              {post.title}
            </h2>
            <p className="text-sm text-[#888] line-clamp-3 mb-4 leading-relaxed">
              {post.content}
            </p>
          </Link>

          {/* Type-Specific Content */}
          {post.post_type === 'poll' && post.poll_data && (
            <div className="mb-4 space-y-2 border border-[#222] p-3 rounded-sm bg-[#050505]">
              {post.poll_data.options.map((opt: any) => {
                const totalVotes = post.poll_data!.totalVotes || 1;
                const percent = Math.round((opt.voteCount / totalVotes) * 100);
                const isSelected = selectedOption === opt.id;
                
                return (
                  <button
                    key={opt.id}
                    onClick={() => handlePollVote(opt.id)}
                    className="relative w-full text-left overflow-hidden rounded-sm border border-[#222] hover:border-[#444] transition-colors p-2 text-sm"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-[#222] opacity-50 pointer-events-none"
                      style={{ width: `${percent}%` }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <span className={isSelected ? 'text-white font-medium' : 'text-[#EDEDED]'}>
                        {opt.text}
                      </span>
                      <span className="text-xs text-[#888]">{percent}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {post.post_type === 'event' && post.event_data && (
            <div className="mb-4 bg-[#050505] border border-[#222] rounded-sm p-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#EDEDED]">
                    <Calendar className="w-4 h-4 text-[#888]" />
                    <span>{new Date(post.event_data.eventDate).toLocaleDateString()} at {post.event_data.eventTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#EDEDED]">
                    <MapPin className="w-4 h-4 text-[#888]" />
                    <span>{post.event_data.location}</span>
                  </div>
                </div>
                <button
                  onClick={handleEventRsvp}
                  className={`px-4 py-1.5 text-sm rounded-sm font-medium transition-colors ${
                    isRsvpd ? 'bg-[#222] text-white border border-[#333]' : 'bg-[#EDEDED] text-black hover:bg-white'
                  }`}
                >
                  {isRsvpd ? 'Going' : 'RSVP'}
                </button>
              </div>
            </div>
          )}

          {post.post_type === 'project' && post.project_data && (
            <div className="mb-4 flex flex-wrap gap-2">
              <div className="text-xs border border-[#222] bg-[#050505] text-[#888] px-2 py-1 rounded-sm uppercase tracking-wider">
                Status: <span className="text-[#EDEDED]">{post.project_data.status}</span>
              </div>
              <div className="text-xs border border-[#222] bg-[#050505] text-[#888] px-2 py-1 rounded-sm uppercase tracking-wider">
                Looking for teammates: <span className="text-[#EDEDED]">{post.project_data.lookingForTeammates ? 'Yes' : 'No'}</span>
              </div>
              {post.project_data.githubUrl && (
                <a href={post.project_data.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs border border-[#222] bg-[#050505] hover:bg-[#111] text-[#EDEDED] px-2 py-1 rounded-sm transition-colors">
                  GitHub <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center gap-6 mt-4 text-[#666]">
            <Link to={`/post/${post.id}`} className="flex items-center gap-1.5 hover:text-[#EDEDED] transition-colors text-xs font-medium">
              <MessageSquare className="w-4 h-4" />
              <span>{post.comments_count}</span>
            </Link>
            <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-[#EDEDED] transition-colors text-xs font-medium">
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button onClick={handleSave} className={`flex items-center gap-1.5 transition-colors text-xs font-medium ${isSaved ? 'text-white' : 'hover:text-[#EDEDED]'}`}>
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
