// ==============================================================================
// Sethu Hub — High-Performance Semantic Embedding Engine
// "Where Sethu Connects."
// ==============================================================================

const VECTOR_DIMENSION = 128;

// Standard English & academic stopwords
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as',
  'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he',
  'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn\'t',
  'it', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of',
  'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
  'shan\'t', 'she', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', 'wasn\'t', 'we', 'were', 'weren\'t', 'what', 'when', 'where', 'which', 'while', 'who', 'whom',
  'why', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

// Murmur-style fast string hash to map tokens into vector dimensions
function hashToken(str: string, seed: number = 0): number {
  let h = seed ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 0x5bd1e995);
    h ^= h >>> 15;
  }
  return (h >>> 0);
}

/**
 * Generates a normalized 128-dimensional semantic embedding vector for a given text.
 * Combines word n-grams, subword frequency, and positional weightings with positive TF.
 */
export function generateEmbedding(text: string): number[] {
  const vector = new Array(VECTOR_DIMENSION).fill(0);
  if (!text || typeof text !== 'string') return vector;

  // Tokenize & normalize
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9_\-\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));

  if (tokens.length === 0) return vector;

  // Word Unigrams, Bigrams, and Subwords with positive term frequency
  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i];
    const dim1 = hashToken(word, 17) % VECTOR_DIMENSION;
    vector[dim1] += 2.0;

    // Bigram context
    if (i < tokens.length - 1) {
      const bigram = `${word}_${tokens[i + 1]}`;
      const dim2 = hashToken(bigram, 53) % VECTOR_DIMENSION;
      vector[dim2] += 2.5;
    }

    // Subwords (for technical stems like pytorch, nextjs, stm32)
    if (word.length >= 4) {
      for (let j = 0; j <= word.length - 3; j++) {
        const tri = word.slice(j, j + 3);
        const dim3 = hashToken(tri, 97) % VECTOR_DIMENSION;
        vector[dim3] += 0.5;
      }
    }
  }

  // L2 Normalization: ||v||_2 = 1
  let sumSq = 0;
  for (let i = 0; i < VECTOR_DIMENSION; i++) {
    sumSq += vector[i] * vector[i];
  }

  const norm = Math.sqrt(sumSq);
  if (norm > 0) {
    for (let i = 0; i < VECTOR_DIMENSION; i++) {
      vector[i] = Number((vector[i] / norm).toFixed(6));
    }
  }

  return vector;
}

/**
 * Calculates the Cosine Similarity between two embedding vectors.
 * Returns value between -1.0 and 1.0 (clamped to 0.0 - 1.0 for similarity).
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  const sim = dotProduct / denominator;
  return Math.max(0, Math.min(1, sim));
}
