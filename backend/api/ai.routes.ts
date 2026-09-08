import { Router, Request, Response } from 'express';
import { AIOrchestrator } from '../../ai/orchestrator/orchestrator.js';
import { optionalAuth, requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

export const aiRouter = Router();

// POST /api/v1/ai/analyze-draft (Agent 1 Post Analyzer + Agent 2 Duplicate Detector)
aiRouter.post('/analyze-draft', optionalAuth, async (req: Request, res: Response) => {
  const { title, content, communitySlug, postType } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({
      success: false,
      error: { code: 'TITLE_REQUIRED', message: 'Title is required for AI draft analysis.' }
    });
  }

  try {
    const result = await AIOrchestrator.analyzeDraft({
      title,
      content: content || '',
      communitySlug,
      postType
    });

    res.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'AI_ANALYSIS_FAILED', message: err.message || 'AI draft analysis failed.' }
    });
  }
});

// POST /api/v1/ai/summarize-post (Agent 3 Discussion Summarizer)
aiRouter.post('/summarize-post', optionalAuth, async (req: Request, res: Response) => {
  const { postId } = req.body;

  if (!postId) {
    return res.status(400).json({
      success: false,
      error: { code: 'POST_ID_REQUIRED', message: 'Post ID is required to summarize discussion.' }
    });
  }

  try {
    const summary = await AIOrchestrator.summarizeDiscussion(postId);
    res.json({
      success: true,
      data: summary
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'AI_SUMMARIZE_FAILED', message: err.message || 'Discussion summarization failed.' }
    });
  }
});

// POST /api/v1/ai/ask (Agent 8 Ask Sethu AI - Grounded RAG Assistant)
aiRouter.post('/ask', optionalAuth, async (req: Request, res: Response) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({
      success: false,
      error: { code: 'QUESTION_REQUIRED', message: 'Question string is required.' }
    });
  }

  try {
    const ragResult = await AIOrchestrator.askRAG({ question });
    res.json({
      success: true,
      data: ragResult
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'RAG_FAILED', message: err.message || 'Ask Sethu AI failed to respond.' }
    });
  }
});

// GET /api/v1/ai/trends (Agent 5 Trend Detector)
aiRouter.get('/trends', async (_req: Request, res: Response) => {
  try {
    const trends = await AIOrchestrator.getTrends();
    res.json({
      success: true,
      data: { trends }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'TRENDS_FAILED', message: 'Failed to retrieve platform trends.' }
    });
  }
});

// GET /api/v1/ai/innovations (Agent 7 Idea Mining Agent: Potential Innovation Opportunities)
aiRouter.get('/innovations', async (_req: Request, res: Response) => {
  try {
    const innovations = await AIOrchestrator.getInnovations();
    res.json({
      success: true,
      data: { innovations }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'INNOVATION_FETCH_FAILED', message: 'Failed to fetch innovation opportunities.' }
    });
  }
});

// POST /api/v1/ai/mine-innovations (Trigger Idea Miner)
aiRouter.post('/mine-innovations', optionalAuth, async (_req: Request, res: Response) => {
  try {
    const innovations = await AIOrchestrator.triggerIdeaMining();
    res.json({
      success: true,
      data: {
        message: 'Idea mining scan completed across student discussions.',
        innovations
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'MINING_FAILED', message: 'Failed to execute idea mining.' }
    });
  }
});

// GET /api/v1/ai/sentiment (Agent 9 Sentiment Analyzer)
aiRouter.get('/sentiment', async (req: Request, res: Response) => {
  const topic = (req.query.topic as string) || 'Campus Transportation';

  try {
    const sentiment = await AIOrchestrator.getTopicSentiment(topic);
    res.json({
      success: true,
      data: sentiment
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SENTIMENT_FAILED', message: 'Failed to analyze topic sentiment.' }
    });
  }
});

// GET /api/v1/ai/knowledge-graph (Agent 10 Knowledge Graph)
aiRouter.get('/knowledge-graph', async (_req: Request, res: Response) => {
  try {
    const graph = await AIOrchestrator.getGraph();
    res.json({
      success: true,
      data: graph
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'GRAPH_FAILED', message: 'Failed to retrieve knowledge graph.' }
    });
  }
});

