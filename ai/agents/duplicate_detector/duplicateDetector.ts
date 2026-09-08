import { generateEmbedding, cosineSimilarity } from '../../embeddings/embeddings.js';
import { query } from '../../../database/db.js';
import { duplicateDetectorSchema, validateAIOutput } from '../../validators/aiValidators.js';

export interface DuplicateDetectionResult {
  has_similar: boolean;
  similarity_score: number;
  similar_posts: Array<{
    id: string;
    title: string;
    similarity: number;
    community: string;
  }>;
}

export async function detectDuplicates(title: string, content: string, currentPostId?: string): Promise<DuplicateDetectionResult> {
  const draftText = `${title} ${content}`;
  const draftVec = generateEmbedding(draftText);

  const existingPosts = query<any>(`
    SELECT p.id, p.title, p.content, c.slug as community_slug
    FROM posts p
    JOIN communities c ON p.community_id = c.id
    WHERE p.is_deleted = 0
    ORDER BY p.created_at DESC
    LIMIT 60
  `);

  const similarList: Array<{ id: string; title: string; similarity: number; community: string }> = [];

  for (const p of existingPosts) {
    if (currentPostId && p.id === currentPostId) continue;

    const targetText = `${p.title} ${p.content}`;
    const targetVec = generateEmbedding(targetText);
    let sim = cosineSimilarity(draftVec, targetVec);

    // Exact word overlap boost in title
    const draftWords = new Set(title.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const targetWords = p.title.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
    const overlapCount = targetWords.filter((w: string) => draftWords.has(w)).length;
    if (overlapCount >= 3) {
      sim = Math.min(0.98, sim + 0.25);
    }

    if (sim >= 0.55) {
      similarList.push({
        id: p.id,
        title: p.title,
        similarity: Math.round(sim * 100),
        community: p.community_slug
      });
    }
  }

  similarList.sort((a, b) => b.similarity - a.similarity);
  const topSimilar = similarList.slice(0, 3);
  const highestScore = topSimilar.length > 0 ? topSimilar[0].similarity / 100 : 0;

  const rawResult = {
    has_similar: topSimilar.length > 0 && highestScore >= 0.65,
    similarity_score: Number(highestScore.toFixed(2)),
    similar_posts: topSimilar
  };

  return validateAIOutput(duplicateDetectorSchema, rawResult, {
    has_similar: false,
    similarity_score: 0,
    similar_posts: []
  });
}

