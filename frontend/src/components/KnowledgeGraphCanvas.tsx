import React, { useEffect, useRef, useState } from 'react';
import { KnowledgeGraphData } from '../services/aiService.js';
import { X, Sparkles } from 'lucide-react';

interface KnowledgeGraphCanvasProps {
  data: KnowledgeGraphData;
}

interface NodePos {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const KnowledgeGraphCanvas: React.FC<KnowledgeGraphCanvasProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodePos | null>(null);
  const nodesRef = useRef<NodePos[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.parentElement?.clientWidth || 800;
    const height = 550;
    canvas.width = width;
    canvas.height = height;

    // Initialize nodes in a radial layout
    const nodes: NodePos[] = data.nodes.map((n, i) => {
      const angle = (i / data.nodes.length) * 2 * Math.PI;
      const dist = 140 + (i % 3) * 60;
      return {
        id: n.id,
        type: n.type,
        label: n.label,
        x: width / 2 + Math.cos(angle) * dist,
        y: height / 2 + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        radius: n.type === 'user' ? 18 : n.type === 'community' ? 22 : n.type === 'project' ? 20 : 15
      };
    });

    nodesRef.current = nodes;

    let animationFrameId: number;
    let frameCount = 0;

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      // Physics relaxation with damping (run for 120 frames then stabilize)
      if (frameCount < 120) {
        frameCount++;
        const damping = 1 - frameCount / 120;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[j].x - nodes[i].x;
            const dy = nodes[j].y - nodes[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 120) {
              const force = ((120 - dist) / 120) * 0.4 * damping;
              nodes[i].x -= (dx / dist) * force;
              nodes[i].y -= (dy / dist) * force;
              nodes[j].x += (dx / dist) * force;
              nodes[j].y += (dy / dist) * force;
            }
          }
        }
      }

      // Draw Edges
      for (const edge of data.edges) {
        const src = nodes.find(n => n.id === edge.source);
        const tgt = nodes.find(n => n.id === edge.target);
        if (src && tgt) {
          ctx.beginPath();
          ctx.moveTo(src.x, src.y);
          ctx.lineTo(tgt.x, tgt.y);
          ctx.strokeStyle = 'rgba(79, 70, 229, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          const midX = (src.x + tgt.x) / 2;
          const midY = (src.y + tgt.y) / 2;
          ctx.font = '9px Inter';
          ctx.fillStyle = '#6B7280';
          ctx.textAlign = 'center';
          ctx.fillText(edge.label, midX, midY);
        }
      }

      // Draw Nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);

        let fillColor = '#4F46E5';
        if (node.type === 'user') fillColor = '#3B82F6';
        else if (node.type === 'community') fillColor = '#8B5CF6';
        else if (node.type === 'skill') fillColor = '#10B981';
        else if (node.type === 'project') fillColor = '#F59E0B';
        else if (node.type === 'topic') fillColor = '#EC4899';

        ctx.fillStyle = fillColor;
        ctx.shadowColor = fillColor;
        ctx.shadowBlur = selectedNode?.id === node.id ? 20 : 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.lineWidth = selectedNode?.id === node.id ? 4 : 2;
        ctx.strokeStyle = selectedNode?.id === node.id ? '#F59E0B' : '#FFFFFF';
        ctx.stroke();

        ctx.font = '11px Inter, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.radius + 14);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [data, selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const clicked = nodesRef.current.find((n) => {
      const dist = Math.sqrt((n.x - clickX) ** 2 + (n.y - clickY) ** 2);
      return dist <= n.radius + 5;
    });

    setSelectedNode(clicked || null);
  };

  return (
    <div className="relative w-full rounded-sm bg-[#050505] border border-[#222] overflow-hidden p-2">
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 text-[10px] bg-[#0A0A0A]/80 backdrop-blur-md p-2 rounded-sm border border-[#222]">
        <span className="flex items-center gap-1 text-blue-400 font-semibold"><span className="h-2 w-2 rounded-full bg-blue-500" /> Student</span>
        <span className="flex items-center gap-1 text-[#888] font-semibold"><span className="h-2 w-2 rounded-full bg-purple-500" /> Community</span>
        <span className="flex items-center gap-1 text-emerald-400 font-semibold"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Skill</span>
        <span className="flex items-center gap-1 text-amber-400 font-semibold"><span className="h-2 w-2 rounded-full bg-amber-500" /> Project</span>
        <span className="flex items-center gap-1 text-pink-400 font-semibold"><span className="h-2 w-2 rounded-full bg-pink-500" /> Topic</span>
      </div>

      {selectedNode && (
        <div className="absolute top-4 right-4 z-20 w-64 rounded-sm bg-[#0A0A0A]/95 border border-[#444] p-4 shadow-lg backdrop-blur-md text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#EDEDED] uppercase tracking-wider text-[10px]">
              {selectedNode.type} Node Info
            </span>
            <button onClick={() => setSelectedNode(null)} className="text-[#888] hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="font-semibold text-sm text-white">{selectedNode.label}</div>
          <div className="text-[11px] text-[#888]">Node ID: {selectedNode.id}</div>
          <div className="pt-2 border-t border-[#222] text-[10px] text-emerald-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>Connected in Sethu Knowledge Topology</span>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-[550px] cursor-pointer block"
      />
    </div>
  );
};


