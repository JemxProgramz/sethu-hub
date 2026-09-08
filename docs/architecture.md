# Sethu Hub — Technical Architecture

> "Where Sethu Connects."

## 1. High-Level Architecture

Sethu Hub is structured as an AI-powered institutional social knowledge platform tailored for Sethu Institute of Technology (SIT).

```
+-------------------------------------------------------------------------+
|                           CLIENT TIER (React 18)                        |
|  - Vite, TypeScript, Tailwind CSS, Lucide Icons                         |
|  - Real-time AI Pre-publish Co-pilot                                    |
|  - Interactive 10-Step Killer Demo Walkthrough                          |
|  - Canvas-based Sethu Knowledge Graph Visualizer                        |
+------------------------------------+------------------------------------+
                                     |
                                     | JSON REST API (JWT Authenticated)
                                     v
+-------------------------------------------------------------------------+
|                           BACKEND API (Node.js)                         |
|  - Express.js, TypeScript                                               |
|  - Bcrypt Password Hashing, JWT Session Management                      |
|  - Strict Server-Side RBAC (Student, Faculty, Moderator, Admin)         |
|  - Zod Input Validation & Sanitization                                  |
|  - Rate Limiting Middleware                                             |
+------------------------------------+------------------------------------+
                                     |
                                     | Intelligent Dispatch
                                     v
+-------------------------------------------------------------------------+
|                          AI ORCHESTRATOR TIER                           |
|  - Router & Dispatcher                                                  |
|  - Agent 1: Post Analyzer (Intent, Category, Department, Tags)          |
|  - Agent 2: Duplicate Detector (Cosine Vector Similarity)               |
|  - Agent 3: Discussion Summarizer (Consensus, Resources, Takeaways)     |
|  - Agent 4: AI Moderator (Toxicity Risk Score, Advisory Queue)          |
|  - Agent 5: Trend Detector (Spike Analysis, Velocity Indicators)        |
|  - Agent 6: Team Matcher (Skill Compatibility & Match Rationale)        |
|  - Agent 7: Idea Miner (Cross-Discussion Pain Point Clustering)         |
|  - Agent 8: Ask Sethu AI (Anti-Hallucination Grounded RAG)              |
|  - Agent 9: Sentiment Analyzer (Aggregate Public Sentiment)             |
|  - Agent 10: Knowledge Graph Builder (Relational Network Topology)     |
+------------------------------------+------------------------------------+
                                     |
                                     | SQLite & High-Dimensional Vectors
                                     v
+-------------------------------------------------------------------------+
|                          STORAGE & EMBEDDING TIER                       |
|  - SQLite (Node 24 Built-In Engine, WAL Mode, Foreign Keys ON)          |
|  - 128-Dimensional Normalized Vector Embeddings                         |
|  - Cosine Similarity Vector Retrieval Index                             |
+-------------------------------------------------------------------------+
```

---

## 2. The Core Innovation Pipeline

Sethu Hub implements the institutional discovery principle:

```
Student Conversations
        ↓
Collective Knowledge
        ↓
AI Understanding
        ↓
Knowledge Discovery
        ↓
Collaboration
        ↓
Innovation
```

---

## 3. Security Guardrails & Defense-in-Depth
- **Authentication**: Salted Bcrypt (10 rounds) password hashing, securely signed JWTs.
- **Authorization**: Granular role-based middleware (`requireRole(['moderator', 'admin'])`). Client-side claims are never trusted.
- **Prompt Injection Defense**: All user-submitted content is isolated within strict content delimiters; LLMs are instructed to treat user text strictly as raw data and never as execution overrides.
- **Advisory AI Moderation**: AI outputs confidence and risk scores, routing flagged content to human moderators. AI never permanently bans users independently.
- **Privacy Assurance**: Profile settings allow hiding contact info; sentiment analysis operates solely on aggregate public discussions.

