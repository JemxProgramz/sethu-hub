import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostItem, postService } from '../services/postService.js';
import { CommentItem, commentService } from '../services/commentService.js';
import { aiService, AISummary } from '../services/aiService.js';
import { PostCard } from '../components/PostCard.js';
import { CommentNode } from '../components/CommentThread.js';
import { useAuth } from '../hooks/useAuth.js';
import {
  Sparkles,
  MessageSquare,
  Send,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [post, setPost] = useState<PostItem | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New comment input
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Discussion Summary state
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const loadData = async () => {
    if (!id) return;
    try {
      const [postRes, commRes] = await Promise.all([
        postService.getPost(id),
        commentService.getComments(id)
      ]);
      setPost(postRes.post);
      setComments(commRes.comments);
      setTotalComments(commRes.totalCount);
    } catch (err: any) {
      setError(err.message || 'Failed to load post');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSummarize = async () => {
    if (!id) return;
    setIsSummarizing(true);
    try {
      const res = await aiService.summarizePost(id);
      setSummary(res);
      setIsSummaryExpanded(true);
    } catch (err) {
      console.error('AI summary error:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id) return;

    setIsSubmitting(true);
    try {
      await commentService.addComment(id, commentText.trim());
      setCommentText('');
      await loadData();
    } catch (err) {
      console.error('Comment submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-xs text-gray-400">
        <Sparkles className="h-6 w-6 text-indigo-400 animate-spin mx-auto mb-2" />
        <span>Loading discussion...</span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-6 text-center">
        <AlertCircle className="h-8 w-8 text-rose-400 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-rose-300">Post Not Found</h3>
        <p className="mt-1 text-xs text-gray-400">{error || 'This post may have been removed or does not exist.'}</p>
        <Link to="/home" className="mt-4 inline-block text-xs font-bold text-indigo-400 hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/home" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to discussions</span>
      </Link>

      {/* Main Post Card */}
      <PostCard post={post} onPostUpdated={loadData} />

      {/* AI Discussion Summarizer Banner / Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#111827] via-[#182234] to-[#111827] border border-indigo-500/30 p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                AI Discussion Summarizer
              </h3>
              <p className="text-[10px] text-gray-400">Synthesizes key arguments, consensus, and action items from {totalComments} comments</p>
            </div>
          </div>

          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isSummarizing ? 'Synthesizing...' : 'Summarize Thread'}</span>
          </button>
        </div>

        {summary && isSummaryExpanded && (
          <div className="mt-4 pt-4 border-t border-[#1F2937] space-y-3.5 text-xs text-gray-300 animate-in fade-in">
            <div>
              <span className="font-bold text-indigo-300">📌 Core Question / Context:</span>
              <p className="mt-0.5 text-gray-300">{summary.main_question}</p>
            </div>

            {summary.key_arguments.length > 0 && (
              <div>
                <span className="font-bold text-purple-300">💡 Key Perspectives & Arguments:</span>
                <ul className="list-disc list-inside mt-1 space-y-1 text-gray-300">
                  {summary.key_arguments.map((arg, i) => (
                    <li key={i}>{arg}</li>
                  ))}
                </ul>
              </div>
            )}

            {summary.common_opinions.length > 0 && (
              <div>
                <span className="font-bold text-emerald-300">🤝 Emerging Consensus:</span>
                <ul className="list-disc list-inside mt-1 space-y-1 text-gray-300">
                  {summary.common_opinions.map((op, i) => (
                    <li key={i}>{op}</li>
                  ))}
                </ul>
              </div>
            )}

            {summary.final_takeaways.length > 0 && (
              <div className="rounded-xl bg-indigo-950/40 border border-indigo-500/20 p-3">
                <span className="font-bold text-white flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Final Takeaways:</span>
                </span>
                <ul className="list-disc list-inside space-y-1 text-gray-200">
                  {summary.final_takeaways.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1F2937]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-400" />
            <span>Discussion ({totalComments})</span>
          </h3>
        </div>

        {/* Comment Box */}
        <form onSubmit={handleAddComment} className="rounded-2xl bg-[#111827] border border-[#1F2937] p-4">
          <textarea
            rows={3}
            placeholder={user ? `Participate in the discussion as ${user.displayName}...` : 'Sign in to join the discussion...'}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={!user}
            className="w-full rounded-xl bg-[#0B0F19] border border-[#1F2937] p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Supports Markdown & code blocks</span>
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim() || !user}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
            </button>
          </div>
        </form>

        {/* Nested Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400 bg-[#111827] rounded-2xl border border-[#1F2937]">
            No replies yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-2">
            {comments.map((c) => (
              <CommentNode
                key={c.id}
                comment={c}
                postAuthorId={post.author_id}
                isQuestionPost={post.post_type === 'question'}
                onCommentAction={loadData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

