import assert from 'node:assert';
import { generateEmbedding, cosineSimilarity } from '../../ai/embeddings/embeddings.js';
import { analyzePost } from '../../ai/agents/post_analyzer/postAnalyzer.js';
import { detectDuplicates } from '../../ai/agents/duplicate_detector/duplicateDetector.js';
import { summarizeDiscussion } from '../../ai/agents/summarizer/summarizer.js';
import { moderateContent } from '../../ai/agents/moderator/moderator.js';
import { detectTrends } from '../../ai/agents/trend_detector/trendDetector.js';
import { matchTeamForProject } from '../../ai/agents/team_matcher/teamMatcher.js';
import { getMinedInnovations } from '../../ai/agents/idea_miner/ideaMiner.js';
import { askSethuAI } from '../../ai/agents/search_assistant/searchAssistant.js';
import { analyzeTopicSentiment } from '../../ai/agents/sentiment/sentimentAnalyzer.js';
import { getKnowledgeGraph } from '../../ai/agents/knowledge_graph/knowledgeGraphBuilder.js';

export async function runAITests() {
  console.log('🤖 Running 10-Agent AI Intelligence Suite Tests...');

  // Test 1: Vector Embeddings & Cosine Similarity
  const v1 = generateEmbedding('Machine learning and artificial intelligence in PyTorch');
  const v2 = generateEmbedding('Deep learning neural networks and PyTorch models');
  const v3 = generateEmbedding('Cafeteria lunch menu with idli and sambar');

  const sim12 = cosineSimilarity(v1, v2);
  const sim13 = cosineSimilarity(v1, v3);
  assert(sim12 > sim13, 'AI topics must have higher semantic similarity than food topics');
  console.log(`  ✅ Vector Engine: Cosine similarity tech(${sim12.toFixed(3)}) > unrelated(${sim13.toFixed(3)})`);

  // Test 2: Agent 1 - Post Analyzer
  const analysis = await analyzePost({
    title: 'How can I start learning machine learning with Python?',
    content: 'Looking for recommended beginner roadmaps and PyTorch tutorials for 2nd year students.',
    postType: 'question'
  });
  assert.strictEqual(analysis.intent, 'question', 'Intent should be question');
  assert(analysis.suggested_tags.includes('AI') || analysis.suggested_tags.includes('MachineLearning'), 'Tags include AI/ML');
  assert(analysis.department_relevance.includes('AI_DS') || analysis.department_relevance.includes('CSE'), 'Relevance includes AI_DS/CSE');
  console.log('  ✅ Agent 1 (Post Analyzer): Correctly extracted intent, tags, and department relevance');

  // Test 3: Agent 2 - Duplicate Detector
  const dupCheck = await detectDuplicates(
    'Bus timing from Madurai Periyar is completely unpredictable during evening peak hours',
    'Buses arrive late after lab dismissal.'
  );
  assert(dupCheck.has_similar, 'Should detect similarity with existing bus timing post');
  assert(dupCheck.similar_posts.length > 0, 'Returns similar posts array');
  console.log(`  ✅ Agent 2 (Duplicate Detector): Detected semantic duplicate with ${dupCheck.similarity_score * 100}% similarity`);

  // Test 4: Agent 3 - Discussion Summarizer
  const summary = await summarizeDiscussion('p-killer-demo');
  assert(summary.main_question.length > 0, 'Main question should be populated');
  assert(summary.key_arguments.length > 0, 'Key arguments should be extracted');
  assert(summary.final_takeaways.length > 0, 'Final takeaways should be present');
  console.log('  ✅ Agent 3 (Discussion Summarizer): Successfully synthesized multi-comment thread');

  // Test 5: Agent 4 - AI Moderator
  const safeCheck = await moderateContent({ targetType: 'post', targetId: 'test-1', content: 'Excited to join the robotics club workshop!' });
  assert(safeCheck.is_safe, 'Constructive message must be deemed safe');
  assert(!safeCheck.requires_human_review, 'No human review needed for clean content');

  const toxicCheck = await moderateContent({ targetType: 'post', targetId: 'test-2', content: 'You are an idiot loser and I will attack you' });
  assert(!toxicCheck.is_safe, 'Toxic harassment must be flagged');
  assert(toxicCheck.requires_human_review, 'Should route to human moderator review');
  console.log('  ✅ Agent 4 (AI Moderator): Clean content approved; toxic pattern flagged for advisory review');

  // Test 6: Agent 5 - Trend Detector
  const trends = await detectTrends();
  assert(trends.length >= 2, 'Trends should be populated');
  assert(trends[0].growth_percent > 0, 'Trend growth percentage should be positive');
  console.log(`  ✅ Agent 5 (Trend Detector): Retrieved ${trends.length} active platform trends`);

  // Test 7: Agent 6 - Team Matcher
  const teamMatch = await matchTeamForProject('p-killer-demo');
  assert(teamMatch.candidates.length > 0, 'Should find matching students');
  assert(teamMatch.candidates[0].match_score > 0, 'Candidate should have positive match score');
  assert(teamMatch.candidates[0].match_rationale.length > 0, 'Candidate should have match rationale');
  console.log(`  ✅ Agent 6 (Team Matcher): Matched ${teamMatch.candidates.length} students with rationale (Top: ${teamMatch.candidates[0].display_name})`);

  // Test 8: Agent 7 - Idea Miner (Signature Feature)
  const innovations = await getMinedInnovations();
  assert(innovations.length >= 2, 'Mined innovation opportunities must exist');
  assert(innovations[0].evidence_post_ids.length >= 2, 'Evidence posts must back the innovation');
  console.log(`  ✅ Agent 7 (Idea Miner): Verified "${innovations[0].title}" backed by student evidence`);

  // Test 9: Agent 8 - Ask Sethu AI (RAG Assistant)
  const ragResponse = await askSethuAI({ question: 'What hackathons are trending at SIT?' });
  assert(ragResponse.citations.length > 0, 'RAG response must include citations to platform discussions');
  assert(ragResponse.answer.includes('TechFest') || ragResponse.answer.includes('hackathon'), 'RAG answer must ground in SIT TechFest discussion');
  console.log('  ✅ Agent 8 (Ask Sethu AI RAG): Grounded response generated with real post citations');

  // Test 10: Agent 9 - Sentiment Analyzer
  const sentiment = await analyzeTopicSentiment('Campus Transportation');
  assert(sentiment.total_posts_analyzed > 0, 'Analyzed posts count should be positive');
  assert(typeof sentiment.negative_percentage === 'number', 'Negative percentage must be a number');
  console.log(`  ✅ Agent 9 (Sentiment Analyzer): ${sentiment.topic} -> Dominant: ${sentiment.dominant_sentiment}`);

  // Test 11: Agent 10 - Knowledge Graph Builder
  const graph = await getKnowledgeGraph();
  assert(graph.nodes.length >= 5, 'Graph should contain nodes');
  assert(graph.edges.length >= 4, 'Graph should contain edges');
  console.log(`  ✅ Agent 10 (Knowledge Graph): Constructed ${graph.nodes.length} nodes and ${graph.edges.length} relational edges`);

  console.log('🎉 All 10 AI Agents and services passed verification!\n');
}

