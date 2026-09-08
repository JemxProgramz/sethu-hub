import React, { useEffect, useState } from 'react';
import { aiService, KnowledgeGraphData } from '../services/aiService.js';
import { KnowledgeGraphCanvas } from '../components/KnowledgeGraphCanvas.js';
import { Network, Sparkles } from 'lucide-react';

export const KnowledgeGraphPage: React.FC = () => {
  const [graphData, setGraphData] = useState<KnowledgeGraphData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    aiService.getKnowledgeGraph()
      .then(res => setGraphData(res))
      .catch(err => console.error('Graph error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Network className="h-5 w-5 text-cyan-400" />
          <span>Agent 10: Sethu Knowledge Graph</span>
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Interactive relational mapping connecting students, verified skills, campus discussions, communities, and innovations
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xs text-gray-400">
          <Sparkles className="h-6 w-6 text-cyan-400 animate-spin mx-auto mb-2" />
          <span>Computing institutional knowledge graph topology...</span>
        </div>
      ) : graphData ? (
        <div className="space-y-4">
          <KnowledgeGraphCanvas data={graphData} />
          <div className="rounded-2xl bg-[#111827] border border-[#1F2937] p-4 text-xs text-gray-400 leading-relaxed">
            <span className="font-bold text-white">How it works: </span>
            The knowledge graph dynamically derives edges (AUTHORED, HAS_SKILL, COLLABORATES_ON, MINED_INTO) as students interact, enabling cross-departmental discovery and interdisciplinary collaboration across Sethu Institute of Technology.
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-xs text-gray-400">Graph data unavailable.</div>
      )}
    </div>
  );
};

