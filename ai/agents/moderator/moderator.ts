import { moderationSchema, validateAIOutput } from '../../validators/aiValidators.js';
import { run } from '../../../database/db.js';

export interface ModerationInput {
  targetType: 'post' | 'comment';
  targetId: string;
  content: string;
}

export interface ModerationResult {
  is_safe: boolean;
  risk_score: number;
  confidence: number;
  category?: string;
  reasoning?: string;
  requires_human_review: boolean;
}

const TOXIC_PATTERNS = [
  { pattern: /\b(hate|idiot|stupid|loser|shut up|kill yourself|useless faculty)\b/i, category: 'Harassment/Abuse', risk: 0.75 },
  { pattern: /\b(free money|click here|telegram crypto|whatsapp group link|earn \$\d+)\b/i, category: 'Spam/Scam', risk: 0.85 },
  { pattern: /\b(exam paper leak|buy grades|bribe|hack portal)\b/i, category: 'Academic Misconduct', risk: 0.9 },
  { pattern: /\b(violence|bomb|attack|threat)\b/i, category: 'Threat/Violence', risk: 0.95 }
];

export async function moderateContent(input: ModerationInput): Promise<ModerationResult> {
  const text = input.content.toLowerCase();
  let maxRisk = 0.05;
  let detectedCategory = 'Clean';
  let reasoning = 'No toxic, abusive, or spam patterns detected. Content aligns with SIT community guidelines.';

  for (const item of TOXIC_PATTERNS) {
    if (item.pattern.test(text)) {
      if (item.risk > maxRisk) {
        maxRisk = item.risk;
        detectedCategory = item.category;
        reasoning = `Detected pattern resembling ${item.category}. Flagged for advisory moderator review.`;
      }
    }
  }

  const isSafe = maxRisk < 0.4;
  const requiresReview = maxRisk >= 0.35;

  const result: ModerationResult = {
    is_safe: isSafe,
    risk_score: Number(maxRisk.toFixed(2)),
    confidence: 0.92,
    category: detectedCategory,
    reasoning,
    requires_human_review: requiresReview
  };

  // If flagged, register an entry in ai_safety_flags for the human moderator queue
  if (requiresReview) {
    try {
      const flagId = `flag-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      run(`
        INSERT INTO ai_safety_flags (id, target_type, target_id, risk_score, confidence, category, reasoning, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_review')
      `, [
        flagId,
        input.targetType,
        input.targetId,
        result.risk_score,
        result.confidence,
        result.category,
        result.reasoning
      ]);
    } catch (err) {
      console.error('[MODERATOR_AGENT] Failed to persist safety flag:', err);
    }
  }

  return validateAIOutput(moderationSchema, result, {
    is_safe: true,
    risk_score: 0.1,
    confidence: 0.9,
    category: 'Clean',
    reasoning: 'Standard community post',
    requires_human_review: false
  });
}

