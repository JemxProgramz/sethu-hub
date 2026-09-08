import React, { useState } from 'react';
import { CommentItem, commentService } from '../services/commentService.js';
import { useAuth } from '../hooks/useAuth.js';
import {
  ChevronUp,
  ChevronDown,
  Reply,
  CheckCircle2,
  GraduationCap,
  Shield,
  Send
} from 'lucide-react';

interface CommentNodeProps {
  comment: CommentItem;
  postAuthorId: string;
  isQuestionPost: boolean;
  onCommentAction: () => void;
  depth?: number;
}

export const CommentNode: React.FC<CommentNodeProps> = ({
  comment,
  postAuthorId,
  isQuestionPost,
  onCommentAction,
  depth = 0
}) => {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = useState(comment.upvotes_count);
  const [downvotes, setDownvotes] = useState(comment.downvotes_count);
  const [userVote, setUserVote] = useState(comment.user_vote || 0);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (direction: 1 | -1) => {
    if (!user) return;
    const newVote = userVote === direction ? 0 : direction;

    if (newVote === 1) setUpvotes(p => p + 1);
    else if (newVote === -1) setDownvotes(p => p + 1);
    else {
      if (userVote === 1) setUpvotes(p => Math.max(0, p - 1));
      if (userVote === -1) setDownvotes(p => Math.max(0, p - 1));
    }
    setUserVote(newVote);

    try {
      const res = await commentService.voteComment(comment.id, newVote);
      setUpvotes(res.upvotesCount);
      setDownvotes(res.downvotesCount);
      setUserVote(res.userVote);
    } catch (err) {
      console.error('Vote comment failed:', err);
    }
  };

  const handleAcceptAnswer = async () => {
    try {
      await commentService.acceptAnswer(comment.id);
      onCommentAction();
    } catch (err) {
      console.error('Accept answer failed:', err);
    }
  };

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await commentService.addComment(comment.post_id, replyText.trim(), comment.id);
      setReplyText('');
      setIsReplying(false);
      onCommentAction();
    } catch (err) {
      console.error('Submit reply failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canAccept =
    isQuestionPost &&
    (user?.id === postAuthorId || user?.role === 'faculty' || user?.role === 'admin') &&
    comment.is_accepted_answer === 0;

  const isAccepted = comment.is_accepted_answer === 1;

  return (
    <div className={`mt-3 ${depth > 0 ? 'ml-4 sm:ml-6 pl-3 sm:pl-4 border-l-2 border-[#1F2937]' : ''}`}>
      <div
        className={`rounded-xl p-3.5 sm:p-4 transition-all ${
          isAccepted
            ? 'bg-emerald-950/20 border-2 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
            : 'bg-[#111827]/80 border border-[#1F2937]'
        }`}
      >
        {/* Accepted Banner */}
        {isAccepted && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2.5 pb-2 border-b border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>ACCEPTED SOLUTION (Verified by Author / Faculty)</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <div className="flex items-center gap-2">
            <img
              src={comment.author_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${comment.author_username}`}
              alt="Avatar"
              className="h-6 w-6 rounded-md bg-gray-800"
            />
            <span className="font-semibold text-gray-200">{comment.author_display_name}</span>
            {comment.author_role === 'faculty' && (
              <span className="flex items-center gap-0.5 text-emerald-400 font-medium text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                <GraduationCap className="h-3 w-3" />
                <span>Faculty</span>
              </span>
            )}
            {comment.author_dept && (
              <span className="text-[10px] text-gray-500">({comment.author_dept})</span>
            )}
          </div>

          <span className="text-[11px] text-gray-400">
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Content */}
        <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </div>

        {/* Bottom Actions */}
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-[#1F2937]/50">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleVote(1)}
              className={`p-1 rounded hover:text-indigo-400 transition-colors ${
                userVote === 1 ? 'text-indigo-400 font-bold' : ''
              }`}
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <span className="font-semibold text-xs">{upvotes - downvotes}</span>
            <button
              onClick={() => handleVote(-1)}
              className={`p-1 rounded hover:text-rose-400 transition-colors ${
                userVote === -1 ? 'text-rose-400 font-bold' : ''
              }`}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Reply className="h-3.5 w-3.5" />
            <span>Reply</span>
          </button>

          {canAccept && (
            <button
              onClick={handleAcceptAnswer}
              className="ml-auto flex items-center gap-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold transition-all"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Mark as Accepted Answer</span>
            </button>
          )}
        </div>

        {/* Reply Form */}
        {isReplying && (
          <form onSubmit={submitReply} className="mt-3 pt-3 border-t border-[#1F2937]">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Reply to ${comment.author_display_name}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 rounded-xl bg-[#0B0F19] border border-[#1F2937] px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={isSubmitting || !replyText.trim()}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50 flex items-center gap-1"
              >
                <Send className="h-3 w-3" />
                <span>Reply</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Recursive Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              postAuthorId={postAuthorId}
              isQuestionPost={isQuestionPost}
              onCommentAction={onCommentAction}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

