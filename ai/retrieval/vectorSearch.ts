import { generateEmbedding, cosineSimilarity } from '../embeddings/embeddings.js';
import { query } from '../../database/db.js';
import { Post } from '../../backend/models/types.js';

export interface SearchResultItem {
  id: string;
  type: 'post' | 'project' | 'community' | 'user';
  title: string;
  content: string;
  url: string;
  similarityScore: number;
  metadata?: any;
}

export function searchSemanticPosts(queryText: string, limit: number = 10, minScore: number = 0.25): SearchResultItem[] {
  const queryVec = generateEmbedding(queryText);

  // Fetch candidate posts with authors and communities
  const rawPosts = query<any>(`
    SELECT p.*, u.username as author_username, pr.display_name as author_display_name,
           c.slug as community_slug, c.name as community_name
    FROM posts p
    JOIN users u ON p.author_id = u.id
    LEFT JOIN profiles pr ON u.id = pr.user_id
    JOIN communities c ON p.community_id = c.id
    WHERE p.is_deleted = 0
    ORDER BY p.created_at DESC
    LIMIT 100
  `);

  const results: SearchResultItem[] = [];

  for (const post of rawPosts) {
    const postContentToEmbed = `${post.title} ${post.content} ${post.community_name}`;
    const postVec = generateEmbedding(postContentToEmbed);
    const score = cosineSimilarity(queryVec, postVec);

    // Boost score if keyword matches exactly in title
    let boostedScore = score;
    const lowerQ = queryText.toLowerCase();
    if (post.title.toLowerCase().includes(lowerQ)) {
      boostedScore = Math.min(1.0, boostedScore + 0.2);
    }

    if (boostedScore >= minScore) {
      results.push({
        id: post.id,
        type: post.post_type === 'project' ? 'project' : 'post',
        title: post.title,
        content: post.content,
        url: `/post/${post.id}`,
        similarityScore: Number(boostedScore.toFixed(3)),
        metadata: {
          postType: post.post_type,
          author: post.author_display_name || post.author_username,
          community: post.community_slug,
          upvotes: post.upvotes_count,
          comments: post.comments_count,
          createdAt: post.created_at
        }
      });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.similarityScore - a.similarityScore);
  return results.slice(0, limit);
}

