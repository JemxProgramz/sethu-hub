import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { aiService, RAGAnswer } from '../services/aiService.js';
import { Search, ArrowRight, BookOpen } from 'lucide-react';

const SUGGESTED_QUERIES = [
  'What hackathons are trending at SIT this month?',
  'Show discussions about Zoho placement preparation.',
  'What are students saying about bus timings?',
  'Which projects are looking for UI teammates?'
];

export const AskSethuAIPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{ q: string; a: RAGAnswer }>>([
    {
      q: 'What hackathons are trending at SIT this month?',
      a: {
        question: 'What hackathons are trending at SIT this month?',
        answer: 'SIT TechFest 2026 is currently the most discussed hackathon on Sethu Hub.\n\nOrganized by the SIT Technical Club and IEEE Student Branch on October 15, 2026. Cash prizes exceed Rs. 1,50,000 across tracks like Smart Campus & IoT, AI for Social Good, and FinTech. Students are currently actively teaming up across departments.',
        confidence: 0.98,
        citations: [
          { postId: 'p-event-hackfest', title: 'SIT TechFest & 24-Hour Hackathon 2026', author: 'Priyadharshini M.', relevanceScore: 0.89 },
          { postId: 'p-killer-demo', title: 'Looking for ML teammates for TechFest', author: 'Karthik Raja', relevanceScore: 0.74 }
        ]
      }
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (e?: React.FormEvent, predefinedQuery?: string) => {
    if (e) e.preventDefault();
    const q = (predefinedQuery || question).trim();
    if (!q) return;

    setIsLoading(true);
    try {
      const res = await aiService.askSethuAI(q);
      setConversation(prev => [...prev, { q, a: res }]);
      setQuestion('');
    } catch (err) {
      console.error('Query failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="border-b border-[#222] pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">Ask Sethu</h1>
        <p className="text-sm text-[#888]">Search your campus knowledge.</p>
      </div>

      <div className="space-y-10">
        {conversation.map((c, i) => (
          <div key={i} className="space-y-6">
            {/* User Question */}
            <h2 className="text-xl font-medium text-white">{c.q}</h2>

            {/* Answer */}
            <div className="text-sm text-[#EDEDED] leading-relaxed whitespace-pre-wrap">
              {c.a.answer}
            </div>

            {/* Sources */}
            {c.a.citations && c.a.citations.length > 0 && (
              <div className="pt-6 space-y-3">
                <div className="text-xs font-medium text-[#666] flex items-center gap-1.5 uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  Sources
                </div>
                <div className="flex flex-col gap-2">
                  {c.a.citations.map((cite, idx) => {
                    const targetUrl = cite.postId.startsWith('p-') ? `/search?q=${encodeURIComponent(cite.title)}` : `/post/${cite.postId}`;
                    return (
                      <Link
                        key={idx}
                        to={targetUrl}
                        className="group flex items-center justify-between text-sm py-2 px-3 bg-[#0A0A0A] border border-[#222] rounded-sm hover:border-[#444] transition-colors"
                      >
                        <div className="truncate flex items-center gap-3">
                          <span className="text-[#EDEDED] font-medium truncate">{cite.title}</span>
                          <span className="text-xs text-[#666] flex-shrink-0">By {cite.author}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#444] group-hover:text-[#EDEDED] transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
            
            {i < conversation.length - 1 && <div className="h-px bg-[#111] w-full my-10"></div>}
          </div>
        ))}
      </div>

      {/* Input Area (Sticky Bottom) */}
      <div className="fixed bottom-0 left-0 w-full lg:pl-64 z-20 bg-[#050505]/90 backdrop-blur-md border-t border-[#111] p-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {conversation.length === 1 && (
             <div className="flex flex-wrap gap-2 mb-2 hidden sm:flex">
               {SUGGESTED_QUERIES.slice(1).map((sq, i) => (
                 <button
                   key={i}
                   onClick={() => handleAsk(undefined, sq)}
                   className="text-xs text-[#888] bg-[#0A0A0A] border border-[#222] rounded-sm px-2.5 py-1.5 hover:text-white hover:border-[#444] transition-colors"
                 >
                   {sq}
                 </button>
               ))}
             </div>
          )}
          
          <form onSubmit={handleAsk} className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about Sethu..."
              className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm py-3 pl-4 pr-12 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#444] shadow-lg"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#666] hover:text-[#EDEDED] disabled:opacity-50 transition-colors bg-[#111] rounded-sm border border-[#222]"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
