import { z } from 'zod';
import { postAnalyzerSchema, validateAIOutput } from '../../validators/aiValidators.js';

export interface PostAnalysisInput {
  title: string;
  content: string;
  communitySlug?: string;
  postType?: string;
}

export type PostAnalysisResult = z.infer<typeof postAnalyzerSchema>;

export async function analyzePost(input: PostAnalysisInput): Promise<PostAnalysisResult> {
  const fullText = `${input.title} ${input.content}`.toLowerCase();

  // 1. Detect Intent
  let intent: 'question' | 'discussion' | 'collaboration' | 'sharing' | 'announcement' | 'feedback' = 'discussion';
  if (
    input.title.includes('?') ||
    fullText.includes('how to') ||
    fullText.includes('how do i') ||
    fullText.includes('why does') ||
    fullText.includes('where can i') ||
    input.postType === 'question'
  ) {
    intent = 'question';
  } else if (
    fullText.includes('team up') ||
    fullText.includes('looking for') ||
    fullText.includes('collaborat') ||
    fullText.includes('who can help') ||
    fullText.includes('need developer') ||
    fullText.includes('hackathon team') ||
    input.postType === 'project'
  ) {
    intent = 'collaboration';
  } else if (
    fullText.includes('announc') ||
    fullText.includes('official') ||
    fullText.includes('circular') ||
    fullText.includes('invites') ||
    input.postType === 'announcement'
  ) {
    intent = 'announcement';
  } else if (
    fullText.includes('unpredictable') ||
    fullText.includes('overcrowded') ||
    fullText.includes('complaint') ||
    fullText.includes('feedback') ||
    fullText.includes('bus timing') ||
    fullText.includes('struggling')
  ) {
    intent = 'feedback';
  } else if (
    fullText.includes('roadmap') ||
    fullText.includes('experience') ||
    fullText.includes('guide') ||
    input.postType === 'showcase' ||
    input.postType === 'opportunity'
  ) {
    intent = 'sharing';
  }

  // 2. Department Relevance & Suggested Tags
  const deptRelevance: string[] = [];
  const suggestedTags: string[] = [];
  let suggestedCommunity = 'general';
  let category = 'general';

  if (fullText.includes('ui') || fullText.includes('ux') || fullText.includes('figma') || fullText.includes('design system') || fullText.includes('frontend')) {
    deptRelevance.push('CSD');
    suggestedTags.push('UI/UX', 'DesignSystems');
    if (!suggestedCommunity || suggestedCommunity === 'general') suggestedCommunity = 'csd';
    category = 'design';
  }
  if (fullText.includes('ai') || fullText.includes('ml') || fullText.includes('pytorch') || fullText.includes('cuda') || fullText.includes('machine learning') || fullText.includes('vision') || fullText.includes('nlp')) {
    deptRelevance.push('AI_DS', 'CSE');
    suggestedTags.push('AI', 'MachineLearning');
    suggestedCommunity = 'ai-ml';
    category = 'tech';
  }
  if (fullText.includes('embedded') || fullText.includes('iot') || fullText.includes('stm32') || fullText.includes('arduino') || fullText.includes('sensors') || fullText.includes('vlsi')) {
    deptRelevance.push('ECE');
    suggestedTags.push('IoT', 'EmbeddedSystems');
    suggestedCommunity = 'ece';
    category = 'hardware';
  }
  if (fullText.includes('robot') || fullText.includes('drone') || fullText.includes('cad') || fullText.includes('solidworks') || fullText.includes('ansys')) {
    deptRelevance.push('MECH');
    suggestedTags.push('Robotics', 'Hardware');
    category = 'engineering';
  }
  if (fullText.includes('placement') || fullText.includes('zoho') || fullText.includes('interview') || fullText.includes('aptitude') || fullText.includes('ctc') || fullText.includes('internship')) {
    deptRelevance.push('CSE', 'CSD', 'IT', 'ECE');
    suggestedTags.push('Placements', 'InterviewPrep');
    suggestedCommunity = 'placements';
    category = 'career';
  }
  if (fullText.includes('bus') || fullText.includes('canteen') || fullText.includes('hostel') || fullText.includes('library') || fullText.includes('campus')) {
    deptRelevance.push('All');
    suggestedTags.push('CampusLife', 'Transport');
    suggestedCommunity = 'campus-life';
    category = 'campus-life';
  }
  if (fullText.includes('hackathon') || fullText.includes('techfest') || fullText.includes('prize') || fullText.includes('smart india')) {
    suggestedTags.push('Hackathon', 'SITEvents');
    suggestedCommunity = 'hackathons';
    category = 'events';
  }

  // If collaboration intent
  if (intent === 'collaboration' || input.postType === 'project') {
    suggestedCommunity = 'projects';
    suggestedTags.push('Collaboration', 'TeamMatch');
  }

  if (deptRelevance.length === 0) deptRelevance.push('General');
  if (suggestedTags.length === 0) suggestedTags.push('Discussion');

  // 3. Sentiment Detection
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  const negativeWords = ['terrible', 'worst', 'unpredictable', 'struggling', 'overcrowded', 'broken', 'disaster', 'failing', 'waiting too long', 'stress'];
  const positiveWords = ['awesome', 'congrats', 'won', 'exciting', 'cleared', 'success', 'great', 'innovative', 'promising', 'love'];

  let negCount = 0;
  let posCount = 0;
  for (const nw of negativeWords) { if (fullText.includes(nw)) negCount++; }
  for (const pw of positiveWords) { if (fullText.includes(pw)) posCount++; }

  if (negCount > posCount) sentiment = 'negative';
  else if (posCount > negCount) sentiment = 'positive';

  // 4. Difficulty
  let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate';
  if (fullText.includes('cuda') || fullText.includes('transformer') || fullText.includes('vlsi') || fullText.includes('kernel') || fullText.includes('distributed')) {
    difficulty = 'advanced';
  } else if (fullText.includes('how to start') || fullText.includes('beginner') || fullText.includes('basics') || fullText.includes('what is')) {
    difficulty = 'beginner';
  }

  // 5. Title Enhancement Suggestion
  let enhancedTitle = input.title;
  if (input.title.length < 25 && intent === 'question') {
    enhancedTitle = `[Question] ${input.title.replace(/\?*$/, '')} - Recommended approach?`;
  } else if (intent === 'collaboration' && !input.title.toLowerCase().includes('looking for') && !input.title.toLowerCase().includes('team')) {
    enhancedTitle = `[Team Recruitment] ${input.title}`;
  }

  const rawResult = {
    topic: suggestedTags[0] ? `${suggestedTags[0]} Focus` : 'Campus Discussion',
    category,
    intent,
    sentiment,
    difficulty,
    department_relevance: deptRelevance,
    suggested_tags: Array.from(new Set(suggestedTags)),
    suggested_community_slug: suggestedCommunity,
    enhanced_title: enhancedTitle !== input.title ? enhancedTitle : undefined,
    collaboration_potential: intent === 'collaboration' || input.postType === 'project',
    confidence: 0.94,
    summary: `Identified ${intent} regarding ${suggestedTags.join(', ')} with ${sentiment} tone.`
  };

  return validateAIOutput(postAnalyzerSchema, rawResult, {
    topic: 'Campus Discussion',
    category: 'general',
    intent: 'discussion',
    sentiment: 'neutral',
    department_relevance: ['General'],
    suggested_tags: ['General'],
    collaboration_potential: false,
    confidence: 0.8
  });
}

