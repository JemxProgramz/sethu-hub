import { query } from '../../../database/db.js';

export interface GraphNode {
  id: string;
  type: string;
  label: string;
  metadata?: any;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  weight: number;
}

export interface KnowledgeGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export async function getKnowledgeGraph(): Promise<KnowledgeGraphData> {
  const nodes = query<any>('SELECT * FROM knowledge_nodes');
  const edges = query<any>('SELECT * FROM knowledge_edges');

  return {
    nodes: nodes.map(n => ({
      id: n.id,
      type: n.node_type,
      label: n.label,
      metadata: JSON.parse(n.metadata || '{}')
    })),
    edges: edges.map(e => ({
      id: e.id,
      source: e.source_id,
      target: e.target_id,
      label: e.relation_type,
      weight: e.weight || 1.0
    }))
  };
}

