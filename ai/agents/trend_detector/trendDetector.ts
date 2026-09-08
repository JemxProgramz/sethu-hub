import { query, run } from '../../../database/db.js';
import { Trend } from '../../../backend/models/types.js';

export async function detectTrends(): Promise<Trend[]> {
  const existingTrends = query<any>('SELECT * FROM trends ORDER BY growth_percent DESC');

  return existingTrends.map(t => ({
    id: t.id,
    topic: t.topic,
    growth_percent: t.growth_percent,
    post_count: t.post_count,
    user_count: t.user_count,
    department: t.department,
    velocity: t.velocity,
    summary: t.summary,
    related_communities: JSON.parse(t.related_communities || '[]'),
    created_at: t.created_at
  }));
}

export async function recalculateTrends(): Promise<Trend[]> {
  // Aggregate recent post tags and volume
  const tagCounts = query<any>(`
    SELECT pt.tag, COUNT(*) as post_count, COUNT(DISTINCT p.author_id) as user_count
    FROM post_tags pt
    JOIN posts p ON pt.post_id = p.id
    WHERE p.is_deleted = 0
    GROUP BY pt.tag
    ORDER BY post_count DESC
    LIMIT 5
  `);

  // Update or return latest trends
  return detectTrends();
}

