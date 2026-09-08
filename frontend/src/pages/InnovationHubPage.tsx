import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiService, InnovationItem } from '../services/aiService.js';
import {
  Lightbulb,
  Sparkles,
  Quote,
  CheckCircle2,
  Building2,
  Wrench,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export const InnovationHubPage: React.FC = () => {
  const [innovations, setInnovations] = useState<InnovationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  const loadInnovations = async () => {
    try {
      const res = await aiService.getInnovations();
      setInnovations(res.innovations);
    } catch (err) {
      console.error('Failed to load innovations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInnovations();
  }, []);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      await aiService.triggerIdeaMining();
      await loadInnovations();
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
              Signature Killer Feature
            </span>
            <span className="text-xs text-gray-400">Agent 7: Idea Mining Engine</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            <span>Potential Innovation Opportunities</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5 max-w-2xl leading-relaxed">
            The AI Idea Mining Agent correlates recurring grievances, questions, and hardware gaps across diverse SIT discussions into actionable incubation projects.
          </p>
        </div>

        <button
          onClick={handleScan}
          disabled={isScanning}
          className="rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white px-4 py-2 text-xs font-bold shadow-lg shadow-yellow-600/20 disabled:opacity-40 transition-all flex items-center gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Mining Conversations...' : 'Mine Cross-Discussions'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading mined opportunities...</div>
      ) : (
        <div className="space-y-6">
          {innovations.map((inn) => (
            <div
              key={inn.id}
              className="rounded-3xl bg-[#111827] border-2 border-yellow-500/30 p-5 sm:p-6 space-y-4 shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                      Status: {inn.status}
                    </span>
                    <span className="text-[11px] text-gray-400">Mined from Student Conversations</span>
                  </div>
                  <h2 className="text-lg font-bold text-white leading-snug">
                    {inn.title}
                  </h2>
                </div>
              </div>

              {/* Problem Statement */}
              <div className="rounded-2xl bg-[#0B0F19] border border-[#1F2937] p-4 text-xs">
                <span className="font-bold text-yellow-400 block mb-1">Problem Statement:</span>
                <p className="text-gray-300 leading-relaxed">{inn.problem_statement}</p>
              </div>

              {/* Discussion Evidence Quotes */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Quote className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Evidence from Student Discussions:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {inn.evidence_snippets?.map((snip, idx) => (
                    <div key={idx} className="rounded-xl bg-[#182234] border border-[#2D3748] p-3 text-xs italic text-gray-300 leading-relaxed">
                      {snip}
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Solution Directions & Required Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl bg-[#182234] border border-[#2D3748] p-4 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Potential Solution Directions:</span>
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-300">
                    {inn.suggested_solutions?.map((sol, idx) => (
                      <li key={idx}>{sol}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-[#182234] border border-[#2D3748] p-4 space-y-2">
                  <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <Wrench className="h-4 w-4" />
                    <span>Required Tech Stack & Skills:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {inn.required_skills?.map((sk, idx) => (
                      <span key={idx} className="rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 text-xs font-semibold">
                        {sk}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 text-[11px] text-gray-400">
                    <span className="font-semibold text-gray-300">Affected Departments: </span>
                    {inn.affected_departments?.join(', ')}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to="/create"
                  className="rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 px-4 py-2 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>Propose Solution as SIT Project</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

