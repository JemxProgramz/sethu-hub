import { analyzePost, PostAnalysisInput, PostAnalysisResult } from '../agents/post_analyzer/postAnalyzer.js';
import { detectDuplicates, DuplicateDetectionResult } from '../agents/duplicate_detector/duplicateDetector.js';
import { summarizeDiscussion, SummarizerResult } from '../agents/summarizer/summarizer.js';
import { moderateContent, ModerationInput, ModerationResult } from '../agents/moderator/moderator.js';
import { detectTrends } from '../agents/trend_detector/trendDetector.js';
import { matchTeamForProject, TeamMatcherResult } from '../agents/team_matcher/teamMatcher.js';
import { getMinedInnovations, mineInnovationOpportunities } from '../agents/idea_miner/ideaMiner.js';
import { askSethuAI, AskSethuAIInput, AskSethuAIResult } from '../agents/search_assistant/searchAssistant.js';
import { analyzeTopicSentiment, AggregateSentimentResult } from '../agents/sentiment/sentimentAnalyzer.js';
import { getKnowledgeGraph, KnowledgeGraphData } from '../agents/knowledge_graph/knowledgeGraphBuilder.js';
import { generateEmbedding } from '../embeddings/embeddings.js';
import { run } from '../../database/db.js';
import { logger } from '../../backend/utils/logger.js';

export class AIOrchestrator {
  /**
   * Pre-publish draft analysis: runs Post Analyzer & Duplicate Detector concurrently
   */
  public static async analyzeDraft(input: PostAnalysisInput): Promise<{
    analysis: PostAnalysisResult;
    duplicates: DuplicateDetectionResult;
  }> {
    logger.ai('Orchestrator', 'Analyzing draft post', { title: input.title });

    const [analysis, duplicates] = await Promise.all([
      analyzePost(input),
      detectDuplicates(input.title, input.content)
    ]);

    return { analysis, duplicates };
  }

  /**
   * Post-publish background processing: analyzes, moderates, and stores vector embedding
   */
  public static async processPublishedPost(postId: string, title: string, content: string): Promise<void> {
    try {
      logger.ai('Orchestrator', 'Processing published post in background', { postId });

      // Run moderation screening
      const modResult = await moderateContent({
        targetType: 'post',
        targetId: postId,
        content: `${title}\n${content}`
      });

      // Run post analysis
      const analysis = await analyzePost({ title, content });

      // Store analysis
      run(`
        INSERT OR REPLACE INTO ai_analyses (id, post_id, topic, category, intent, sentiment, difficulty, department_relevance, suggested_tags, collaboration_potential, confidence, summary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        `ai-${postId}`,
        postId,
        analysis.topic,
        analysis.category,
        analysis.intent,
        analysis.sentiment,
        analysis.difficulty || 'intermediate',
        JSON.stringify(analysis.department_relevance),
        JSON.stringify(analysis.suggested_tags),
        analysis.collaboration_potential ? 1 : 0,
        analysis.confidence,
        analysis.summary || ''
      ]);

      // Generate and store embedding vector
      const vector = generateEmbedding(`${title} ${content}`);
      run(`
        INSERT OR REPLACE INTO ai_embeddings (id, target_type, target_id, embedding_vector)
        VALUES (?, 'post', ?, ?)
      `, [`emb-${postId}`, postId, JSON.stringify(vector)]);

    } catch (err) {
      logger.error(`Failed to process published post ${postId}:`, err);
    }
  }

  /**
   * Summarize discussion thread
   */
  public static async summarizeDiscussion(postId: string): Promise<SummarizerResult> {
    logger.ai('Orchestrator', 'Summarizing discussion thread', { postId });
    return summarizeDiscussion(postId);
  }

  /**
   * Team matchmaking for project
   */
  public static async matchTeam(projectIdOrPostId: string): Promise<TeamMatcherResult> {
    logger.ai('Orchestrator', 'Executing team matcher', { projectIdOrPostId });
    return matchTeamForProject(projectIdOrPostId);
  }

  /**
   * Ask Sethu AI (RAG Assistant)
   */
  public static async askRAG(input: AskSethuAIInput): Promise<AskSethuAIResult> {
    logger.ai('Orchestrator', 'Processing RAG query', { question: input.question });
    return askSethuAI(input);
  }

  /**
   * Retrieve platform trends
   */
  public static async getTrends() {
    return detectTrends();
  }

  /**
   * Retrieve or mine innovation opportunities
   */
  public static async getInnovations() {
    return getMinedInnovations();
  }

  public static async triggerIdeaMining() {
    return mineInnovationOpportunities();
  }

  /**
   * Aggregate public topic sentiment
   */
  public static async getTopicSentiment(topic: string): Promise<AggregateSentimentResult> {
    return analyzeTopicSentiment(topic);
  }

  /**
   * Retrieve knowledge graph
   */
  public static async getGraph(): Promise<KnowledgeGraphData> {
    return getKnowledgeGraph();
  }
}

