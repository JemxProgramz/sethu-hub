# Sethu Hub — Database Architecture & Schema Documentation

> Database Engine: SQLite (Node.js 24 Native `DatabaseSync` engine) with `PRAGMA foreign_keys = ON` and WAL mode.

---

## Entity Relationship Overview

```
[Users] 1 ────── 1 [Profiles]
  │
  ├────── * [Posts] 1 ────── * [Comments]
  │           │                  │
  │           ├────── * [Post Tags]
  │           ├────── 1 [Projects] 1 ────── * [Project Members]
  │           ├────── 1 [Polls] 1 ────── * [Poll Options]
  │           ├────── 1 [Events] 1 ────── * [Event RSVPs]
  │           ├────── 1 [AI Analyses]
  │           └────── 1 [AI Embeddings]
  │
  ├────── * [Community Members] * ────── 1 [Communities]
  ├────── * [Votes] (Target: post or comment)
  ├────── * [Saves]
  ├────── * [Reports]
  ├────── * [User Badges] * ────── 1 [Badges]
  └────── * [Notifications]

[Trends] (Calculated from rolling post velocity)
[Innovation Opportunities] (Mined from cross-discussion clusters)
[Knowledge Nodes] * ────── * [Knowledge Edges]
```

---

## Core Tables & Primary Indexes

1. `users`: Stores core credentials (`password_hash`), institutional role (`student`, `faculty`, `moderator`, `admin`), and reputation.
2. `profiles`: Extended profile data (department, year, skills JSON array, interests JSON array, bio).
3. `communities`: Hub definitions with slugs (e.g. `/c/csd`, `/c/ai-ml`), rules, member counts.
4. `posts`: 8 post types with metadata JSON payload for post-specific fields.
   - Index: `idx_posts_community` on `community_id`
   - Index: `idx_posts_type` on `post_type`
   - Index: `idx_posts_created` on `created_at DESC`
5. `comments`: Hierarchical tree with `parent_id` (NULL for root comments) and `is_accepted_answer`.
   - Index: `idx_comments_post` on `post_id`
   - Index: `idx_comments_parent` on `parent_id`
6. `ai_analyses`: AI classification metrics (intent, sentiment, difficulty, department relevance).
7. `ai_embeddings`: 128-dimensional normalized embedding vectors for cosine similarity retrieval.
8. `innovation_opportunities`: Mined problem statements, evidence snippets, affected departments, and proposed solutions.
9. `knowledge_nodes` & `knowledge_edges`: Relational network topology representing the SIT institutional graph.

