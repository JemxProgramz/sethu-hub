import React, { useEffect, useRef, useState } from 'react';
import { KnowledgeGraphData } from '../services/aiService.js';

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

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      // Simple physics relaxation
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 120) {
            const force = (120 - dist) / 120 * 0.4;
            nodes[i].x -= (dx / dist) * force;
            nodes[i].y -= (dy / dist) * force;
            nodes[j].x += (dx / dist) * force;
            nodes[j].y += (dy / dist) * force;
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

          // Edge Label
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

        // Node coloring by type
        let fillColor = '#4F46E5'; // default indigo
        if (node.type === 'user') fillColor = '#3B82F6';
        else if (node.type === 'community') fillColor = '#8B5CF6';
        else if (node.type === 'skill') fillColor = '#10B981';
        else if (node.type === 'project') fillColor = '#F59E0B';
        else if (node.type === 'topic') fillColor = '#EC4899';

        ctx.fillStyle = fillColor;
        ctx.shadowColor = fillColor;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        // Node Label
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
  }, [data]);

  return (
    <div className="relative w-full rounded-2xl bg-[#0B0F19] border border-[#1F2937] overflow-hidden p-2">
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 text-[10px] bg-[#111827]/80 backdrop-blur-md p-2 rounded-xl border border-[#1F2937]">
        <span className="flex items-center gap-1 text-blue-400 font-semibold"><span className="h-2 w-2 rounded-full bg-blue-500" /> Student</span>
        <span className="flex items-center gap-1 text-purple-400 font-semibold"><span className="h-2 w-2 rounded-full bg-purple-500" /> Community</span>
        <span className="flex items-center gap-1 text-emerald-400 font-semibold"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Skill</span>
        <span className="flex items-center gap-1 text-amber-400 font-semibold"><span className="h-2 w-2 rounded-full bg-amber-500" /> Project</span>
        <span className="flex items-center gap-1 text-pink-400 font-semibold"><span className="h-2 w-2 rounded-full bg-pink-500" /> Topic</span>
      </div>

      <canvas ref={canvasRef} className="w-full h-[550px] cursor-grab active:cursor-grabbing block" />
    </div>
  );
};

