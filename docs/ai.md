# Sethu Hub — 10 AI Intelligence Agents & Orchestrator

Sethu Hub does not use AI as a generic chatbot. Instead, it deploys **10 specialized intelligence agents** coordinated by a central orchestrator.

---

## The 10 Specialized AI Agents

### Agent 1 — Post Analyzer
- **Role**: Pre-publish draft evaluator & post categorizer.
- **Outputs**: Topic, Intent, Category, Sentiment, Difficulty, Department Relevance, Suggested Tags, Target Community, Title Enhancements.
- **Validation**: Schema-validated via `postAnalyzerSchema`.

### Agent 2 — Duplicate Detector
- **Role**: Semantic similarity scanner preventing redundant discussions.
- **Mechanism**: 128-dimensional vector cosine distance calculation.
- **Behavior**: Advisory warning with similarity % and links; does not block publication.

### Agent 3 — Discussion Summarizer
- **Role**: High-volume conversation synthesizer.
- **Outputs**: Main Question, Key Perspectives, Emerging Consensus, Disagreements, Shared Resources, Final Actionable Takeaways.
- **Policy**: Grounded strictly in comment text; zero hallucinations.

### Agent 4 — AI Moderator
- **Role**: Real-time content safety screening.
- **Scans**: Toxicity, harassment, hate speech, exam misconduct, scam patterns.
- **Behavior**: Advisory Human-in-the-Loop decision model. Routes flagged content with confidence and explanation to moderator queue. Never executes irreversible automated bans.

### Agent 5 — Trend Detector
- **Role**: Platform-wide velocity and spike tracking.
- **Outputs**: Topic, Growth % (e.g. +240% this week), Post count, Contributing student volume, Velocity indicator (Spike, Rapidly Rising).

### Agent 6 — Team Matching Agent
- **Role**: Inter-departmental project teammate matchmaking.
- **Inputs**: Required skills, project problem statement, open roles.
- **Outputs**: Ranked candidate profiles with match score (0-100%) and human-readable rationale ("Why they match").

### Agent 7 — Idea Mining Agent (Signature Killer Feature)
- **Role**: Institutional problem discovery engine.
- **Mechanism**: Correlates recurring complaints and questions across disparate discussions (e.g. bus timings, lab GPU shortages, note sharing).
- **Outputs**: Structured **Potential Innovation Opportunities** with problem statement, evidence quotes from student posts, affected departments, and suggested solution directions.

### Agent 8 — Ask Sethu AI (RAG Assistant)
- **Role**: Institutional query assistant.
- **Pipeline**: Question → Embedding → Cosine Vector Retrieval → Context Construction → Grounded Response with post citations.
- **Policy**: If platform evidence is insufficient, states: *"I couldn't find enough information on Sethu Hub to answer that reliably."*

### Agent 9 — Sentiment & Opinion Analyzer
- **Role**: Aggregate public student opinion evaluator.
- **Outputs**: Positive / Neutral / Negative percentage breakdown per community or campus topic.
- **Privacy**: Operates exclusively on aggregate public posts; never builds private individual psychological profiles.

### Agent 10 — Knowledge Graph Builder
- **Role**: Relational network builder connecting SIT entities.
- **Nodes**: Students, Faculty, Communities, Posts, Skills, Topics, Innovation Projects.
- **Edges**: AUTHORED, HAS_SKILL, BELONGS_TO, COLLABORATES_ON, MINED_INTO.

---

## AI Agent Orchestrator

The `AIOrchestrator` implements smart dispatching:
- Actions execute only the relevant agents rather than running all 10 on every request.
- Background tasks (embeddings, moderation flags, graph syncing) run asynchronously without blocking the user response.
- Pluggable provider architecture: uses built-in high-performance deterministic semantic engine out-of-the-box, seamlessly switching to live Google Gemini API when `GEMINI_API_KEY` is provided.

