import React, { useState } from 'react';
import { aiService, AIDraftAnalysis } from '../services/aiService.js';
import { Sparkles, AlertTriangle, ArrowRight, Check, Tag, Hash, Building2, HelpCircle } from 'lucide-react';

interface AIPrePublishCoPilotProps {
  title: string;
  content: string;
  postType: string;
  selectedCommunity: string;
  selectedTags: string[];
  onSelectCommunity: (slug: string) => void;
  onAddTag: (tag: string) => void;
  onApplyTitle: (enhancedTitle: string) => void;
}

export const AIPrePublishCoPilot: React.FC<AIPrePublishCoPilotProps> = ({
  title,
  content,
  postType,
  selectedCommunity,
  selectedTags,
  onSelectCommunity,
  onAddTag,
  onApplyTitle
}) => {
  const [analysisResult, setAnalysisResult] = useState<AIDraftAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = async () => {
    if (!title.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await aiService.analyzeDraft({
        title,
        content,
        communitySlug: selectedCommunity,
        postType
      });
      setAnalysisResult(res);
    } catch (err) {
      console.error('Pre-publish analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#111827] to-[#182234] border border-indigo-500/30 p-4 sm:p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            AI Pre-Publish Assistant
          </h3>
        </div>
        <button
          onClick={runAnalysis}
          disabled={isAnalyzing || !title.trim()}
          className="rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 px-3 py-1 text-xs font-bold text-indigo-300 disabled:opacity-40 transition-all"
        >
          {isAnalyzing ? '✨ Analyzing...' : '✨ Analyze Draft'}
        </button>
      </div>

      {!analysisResult && !isAnalyzing && (
        <div className="py-4 text-xs text-gray-400 leading-relaxed text-center">
          Type your title and body, then click <strong className="text-indigo-300">Analyze Draft</strong>. The AI Intelligence Layer will suggest optimal communities, tags, title enhancements, and detect similar existing discussions.
        </div>
      )}

      {isAnalyzing && (
        <div className="py-6 flex flex-col items-center justify-center gap-2 text-xs text-indigo-300">
          <Sparkles className="h-6 w-6 animate-spin text-indigo-400" />
          <span>✨ AI is analyzing draft, checking duplicates & department relevance...</span>
        </div>
      )}

      {analysisResult && (
        <div className="mt-4 space-y-4">
          {/* Duplicate Detection Alert */}
          {analysisResult.duplicates.has_similar && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Similar Discussion Found ({Math.round(analysisResult.duplicates.similarity_score * 100)}% match)</span>
              </div>
              <p className="text-[11px] text-gray-300">
                A semantically similar post exists in SIT Hub. You can still publish, or review existing insights:
              </p>
              <div className="mt-2 space-y-1">
                {analysisResult.duplicates.similar_posts.map((p) => (
                  <a
                    key={p.id}
                    href={`/post/${p.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block font-medium text-amber-400 hover:underline text-[11px]"
                  >
                    → "{p.title}" (/c/{p.community})
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Title Enhancement */}
          {analysisResult.analysis.enhanced_title && analysisResult.analysis.enhanced_title !== title && (
            <div className="rounded-xl bg-[#0B0F19] border border-[#1F2937] p-3 text-xs">
              <div className="text-gray-400 text-[11px] font-semibold">Suggested Enhanced Title:</div>
              <div className="mt-1 font-bold text-white text-xs">"{analysisResult.analysis.enhanced_title}"</div>
              <button
                onClick={() => onApplyTitle(analysisResult.analysis.enhanced_title!)}
                className="mt-2 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Apply Suggestion</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Community Suggestion */}
          {analysisResult.analysis.suggested_community_slug && (
            <div className="flex items-center justify-between text-xs rounded-xl bg-[#0B0F19] border border-[#1F2937] p-2.5">
              <div className="flex items-center gap-2 text-gray-300">
                <Building2 className="h-4 w-4 text-indigo-400" />
                <span>Recommended Hub:</span>
                <span className="font-bold text-white">/c/{analysisResult.analysis.suggested_community_slug}</span>
              </div>
              <button
                onClick={() => onSelectCommunity(analysisResult.analysis.suggested_community_slug!)}
                className="text-[11px] font-bold text-indigo-400 hover:underline"
              >
                Select
              </button>
            </div>
          )}

          {/* Recommended Tags */}
          {analysisResult.analysis.suggested_tags.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-gray-400 mb-1.5 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-indigo-400" />
                <span>Suggested Tags (click to add):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.analysis.suggested_tags.map((tag, i) => {
                  const isAdded = selectedTags.includes(tag);
                  return (
                    <button
                      key={i}
                      onClick={() => !isAdded && onAddTag(tag)}
                      className={`rounded-lg px-2 py-0.5 text-xs font-medium border transition-colors flex items-center gap-1 ${
                        isAdded
                          ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                          : 'bg-[#0B0F19] text-gray-300 border-[#1F2937] hover:border-gray-500'
                      }`}
                    >
                      <span>#{tag}</span>
                      {isAdded && <Check className="h-3 w-3 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Categorization Breakdown */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400 pt-2 border-t border-[#1F2937]">
            <div>Intent: <span className="text-white font-semibold capitalize">{analysisResult.analysis.intent}</span></div>
            <div>Sentiment: <span className="text-white font-semibold capitalize">{analysisResult.analysis.sentiment}</span></div>
            <div>Category: <span className="text-white font-semibold capitalize">{analysisResult.analysis.category}</span></div>
            <div>Confidence: <span className="text-emerald-400 font-semibold">{Math.round(analysisResult.analysis.confidence * 100)}%</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

