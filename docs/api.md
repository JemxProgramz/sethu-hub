# Sethu Hub — REST API Specification (`/api/v1/...`)

All endpoints return standard response envelopes:

```json
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable explanation"
  }
}
```

---

## 1. Authentication & Profile (`/api/v1/auth`)

### `POST /api/v1/auth/register`
Registers a new user.
```json
{
  "username": "karthik_csd",
  "email": "karthik.csd@sethu.ac.in",
  "password": "Password123",
  "displayName": "Karthik Raja",
  "department": "CSD",
  "year": 3
}
```

### `POST /api/v1/auth/login`
Authenticates a user and returns a JWT.
```json
{
  "login": "karthik_csd",
  "password": "sethu123"
}
```

### `POST /api/v1/auth/demo-switch`
Instantly logs in as one of the 4 verified SIT demo personas:
- `student` (`karthik_csd`)
- `faculty` (`dr_ramanathan`)
- `moderator` (`priya_mod`)
- `admin` (`admin_sethu`)

### `GET /api/v1/auth/me`
Returns current user's profile, badges, and reputation.

---

## 2. Posts & Feeds (`/api/v1/posts`)

### `GET /api/v1/posts`
Query parameters:
- `tab`: `home` | `popular` | `latest` | `following` | `ai_recommended`
- `type`: `all` | `discussion` | `question` | `project` | `opportunity` | `event` | `poll` | `showcase`
- `community`: community slug (e.g. `csd`, `projects`)
- `tag`: filter by hashtag
- `page`, `limit`: pagination

### `POST /api/v1/posts`
Creates a post across 8 post types. Triggers AI analyzer, duplicate check, and vector embedding storage.

### `POST /api/v1/posts/:id/vote`
Casts or updates vote: `{ "voteValue": 1 | -1 | 0 }`.

### `POST /api/v1/posts/:id/save`
Toggles saving post to user profile.

---

## 3. Comments & Nested Threads (`/api/v1`)

### `GET /api/v1/posts/:id/comments`
Retrieves recursive nested comment tree with user votes and accepted answer flag.

### `POST /api/v1/posts/:id/comments`
Submits a root comment or nested reply (`parentId`).

### `POST /api/v1/comments/:id/accept`
Marks an answer as the **Accepted Solution** (question author or faculty/admin only). Awards +50 reputation to answer author.

---

## 4. AI Intelligence Layer (`/api/v1/ai`)

### `POST /api/v1/ai/analyze-draft`
Runs Agent 1 (Post Analyzer) and Agent 2 (Duplicate Detector) on draft text.

### `POST /api/v1/ai/summarize-post`
Runs Agent 3 (Discussion Summarizer) to synthesize lengthy comment threads.

### `POST /api/v1/ai/ask`
Runs Agent 8 (Ask Sethu AI RAG) returning grounded answers with verified citations.

### `GET /api/v1/ai/trends`
Runs Agent 5 (Trend Detector) returning topic growth %, post volume, and velocity.

### `GET /api/v1/ai/innovations`
Runs Agent 7 (Idea Miner) returning mined Potential Innovation Opportunities.

### `GET /api/v1/ai/knowledge-graph`
Runs Agent 10 (Knowledge Graph Builder) returning topology nodes and edges.

