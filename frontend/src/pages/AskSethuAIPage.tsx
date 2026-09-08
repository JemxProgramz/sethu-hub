import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { aiService, RAGAnswer } from '../services/aiService.js';
import {
  Sparkles,
  Send,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Clock,
  BookOpen
} from 'lucide-react';

const SUGGESTED_QUERIES = [
  'What hackathons are trending at SIT this month?',
  'Show discussions about Zoho placement preparation and interview experiences.',
  'What are students saying about Madurai and Virudhunagar bus timings?',
  'How do I resolve CUDA OOM errors on the departmental GPU node?',
  'Which projects are actively looking for AI and UI teammates?'
];

export const AskSethuAIPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{ q: string; a: RAGAnswer }>>([
    {
      q: 'What hackathons are trending at SIT this month?',
      a: {
        question: 'What hackathons are trending at SIT this month?',
        answer: 'Based on discussions in **/c/events** and **/c/hackathons**, the upcoming flagship event is **SIT TechFest & 24-Hour Hackathon 2026** organized by the SIT Technical Club and IEEE Student Branch on October 15, 2026. Cash prizes exceed Rs. 1,50,000 across tracks like Smart Campus & IoT, AI for Social Good, and FinTech. Students are currently actively teaming up across departments.',
        confidence: 0.98,
        citations: [
          { postId: 'p-event-hackfest', title: 'SIT TechFest & 24-Hour Hackathon 2026', author: 'Priyadharshini M.', relevanceScore: 0.89 },
          { postId: 'p-killer-demo', title: 'I want to build an AI project but I don\'t know who can help me', author: 'Karthik Raja', relevanceScore: 0.74 }
        ]
      }
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (queryToAsk: string) => {
    const q = queryToAsk.trim();
    if (!q) return;

    setIsLoading(true);
    try {
      const res = await aiService.askSethuAI(q);
      setConversation(prev => [...prev, { q, a: res }]);
      setQuestion('');
    } catch (err) {
      console.error('RAG query failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span>Ask Sethu AI (RAG Assistant)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Answers grounded strictly in real Sethu Institute of Technology discussions, projects, and collective student knowledge
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Zero-Hallucination Grounded</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Try asking about campus knowledge:
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleAsk(sq)}
              className="rounded-xl bg-[#111827] hover:bg-[#182234] border border-[#1F2937] hover:border-purple-500/40 px-3 py-1.5 text-xs text-gray-300 hover:text-white transition-all text-left"
            >
              💬 {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Stream */}
      <div className="space-y-4">
        {conversation.map((c, i) => (
          <div key={i} className="space-y-3">
            {/* User Question */}
            <div className="flex justify-end">
              <div className="max-w-xl rounded-2xl rounded-tr-sm bg-indigo-600 px-4 py-3 text-xs text-white shadow-lg leading-relaxed">
                {c.q}
              </div>
            </div>

            {/* AI Grounded Response Card */}
            <div className="rounded-2xl bg-[#111827] border border-purple-500/30 p-5 space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1F2937] pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>Sethu AI Answer</span>
                </div>
                <span className="text-[10px] text-gray-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Confidence: {Math.round(c.a.confidence * 100)}%
                </span>
              </div>

              <div className="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap">
                {c.a.answer}
              </div>

              {/* Verified Citations */}
              {c.a.citations && c.a.citations.length > 0 && (
                <div className="pt-3 border-t border-[#1F2937] space-y-2">
                  <div className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Source Citations on Sethu Hub:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {c.a.citations.map((cite, idx) => (
                      <Link
                        key={idx}
                        to={`/post/${cite.postId}`}
                        className="rounded-xl bg-[#0B0F19] hover:bg-[#182234] border border-[#1F2937] p-2.5 text-xs text-indigo-300 hover:text-white transition-colors flex items-center justify-between gap-2"
                      >
                        <div className="truncate">
                          <div className="font-semibold truncate">{cite.title}</div>
                          <div className="text-[10px] text-gray-500">By {cite.author}</div>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="rounded-2xl bg-[#111827] border border-purple-500/30 p-6 flex items-center justify-center gap-3 text-xs text-purple-300">
            <Sparkles className="h-5 w-5 animate-spin text-purple-400" />
            <span>Searching institutional knowledge base & retrieving citations...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="sticky bottom-20 lg:bottom-4 rounded-2xl bg-[#111827] border border-[#1F2937] p-2 shadow-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(question);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask a question about SIT courses, bus logistics, hackathons, lab servers..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 rounded-xl bg-[#0B0F19] border border-[#1F2937] px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-3 text-xs font-bold text-white disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-lg shadow-purple-600/20"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};

