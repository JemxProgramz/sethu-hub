# Sethu Hub

<div align="center">

### *"Where Sethu Connects."*

An AI-Powered Institutional Social Knowledge Network engineered specifically for the students, faculty, and research communities of **Sethu Institute of Technology (SIT)**.

</div>

---

## 🌟 Product Vision

Sethu Hub is not a generic discussion board or a simple Reddit clone. It represents a paradigm shift in institutional computing:

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

By coupling a modern, dark-first social interaction layer with a **10-Agent AI Intelligence Suite**, Sethu Hub continuously monitors conversations, matches cross-department project teams, aggregates student sentiment, prevents toxicity with human-in-the-loop moderation, and mines recurring campus problems into structured **Potential Innovation Opportunities**.

---

## 🚀 Key Features

### 1. Modern Social Knowledge Network
- **8 Distinct Post Types**: Discussion, Question (Stack Overflow style with Accepted Answer), Project, Opportunity, Event, Announcement, Poll (live voting), and Showcase.
- **Sethu Communities (`/c/...`)**: Dedicated hubs for SIT streams including `/c/cse`, `/c/csd`, `/c/ai-ml`, `/c/ece`, `/c/projects`, `/c/hackathons`, `/c/placements`, `/c/campus-life`, `/c/research`.
- **Nested Discussions**: Hierarchical multi-level comment threads with voting, markdown support, and author badges.
- **Sethu Reputation System**: Meritocratic reputation points and badges (Problem Solver, Helpful Contributor, Project Builder, Research Explorer, Community Leader, Mentor).

### 2. The 10 AI Agents & Orchestration Layer
1. **Post Analyzer**: Classifies intent, category, sentiment, difficulty, department relevance, and tags.
2. **Duplicate Detector**: Performs vector cosine similarity comparison to warn users of existing discussions before publishing.
3. **Discussion Summarizer**: Synthesizes lengthy comment threads into Core Question, Arguments, Consensus, Disagreements, and Key Takeaways.
4. **AI Moderator**: Real-time screening for spam, harassment, and toxicity with safety risk scoring (Advisory Human-in-the-Loop decision model).
5. **Trend Detector**: Computes velocity growth percentages and detects spikes in student concerns across time windows.
6. **Team Matching Agent**: Automatically matches project skill requirements with student profiles and explains compatibility.
7. **Idea Mining Agent (Signature Killer Feature)**: Scans multiple student discussions, detects recurring pain points (e.g. transport, lab access, internships), and creates actionable **Potential Innovation Opportunities**.
8. **Ask Sethu AI (RAG Assistant)**: Conversational assistant answering queries grounded exclusively in real platform discussions with source citations.
9. **Sentiment & Opinion Analyzer**: Aggregates public topic sentiment without compromising individual privacy.
10. **Knowledge Graph Builder**: Maps relationships between students, skills, topics, communities, and projects.

### 3. Collaboration & Projects Engine
- Dedicated project boards with problem statements, required tech stack, open roles, and team rosters.
- In-platform "Request to Join" workflow with owner approval.
- One-click AI candidate matching across SIT departments.

### 4. Interactive Killer Demo Flow
- Built-in interactive walkthrough recreating the full 10-step Sethu Hub story:
  1. Student posts: *"I want to build an AI project but I don't know who can help me."*
  2. AI analyzes draft.
  3. AI suggests `/c/projects` and tags `#AI #Collaboration`.
  4. AI matches students across departments based on verified skills.
  5. Peer comments to join.
  6. Discussion thread expands.
  7. AI synthesizes discussion summary.
  8. Trend Detector records surge in AI collaboration requests.
  9. Idea Miner detects recurring cross-department resource bottleneck.
  10. Sethu Hub crystallizes an official **Potential Innovation Opportunity**.

---

## 📂 Repository Structure

```
sethu-hub/
├── AGENTS.md                  # Development rules & AI standards
├── README.md                  # Project documentation & overview
├── .env.example               # Environment template
│
├── frontend/                  # React 18, Vite, TypeScript, Tailwind CSS
│   ├── src/
│   │   ├── components/        # PostCard, CommentThread, AIInsight, etc.
│   │   ├── pages/             # Home, PostDetail, CreatePost, AskAI, etc.
│   │   ├── layouts/           # MainLayout, Sidebar, Navbar, MobileNav
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API & AI client services
│   │   └── styles/            # Dark-first design system tokens
│
├── backend/                   # Node.js, Express, TypeScript, SQLite
│   ├── api/                   # REST API routes (/api/v1/...)
│   ├── models/                # TypeScript interfaces & DB entities
│   ├── schemas/               # Zod validation schemas
│   ├── services/              # Business logic layer
│   ├── repositories/          # Database repositories
│   ├── middleware/            # Auth, RBAC, RateLimit, ErrorHandling
│   └── workers/               # Background AI analysis jobs
│
├── ai/                        # AI Intelligence Layer
│   ├── orchestrator/          # Intelligent routing dispatcher
│   ├── agents/                # 10 specialized AI agents
│   ├── embeddings/            # Vector embeddings & similarity
│   ├── retrieval/             # RAG retrieval & context construction
│   ├── prompts/               # Agent system prompts
│   └── validators/            # Strict response validation
│
├── database/
│   ├── migrations/            # Relational database schema
│   └── seed/                  # Realistic SIT seed data (50+ users, 120+ posts)
│
├── tests/                     # Unit, integration, and AI tests
└── docs/                      # Technical documentation
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### Quick Start
```bash
# 1. Navigate to project root
cd sethu-hub

# 2. Install dependencies
npm install

# 3. Setup environment configuration
cp .env.example .env

# 4. Seed database with realistic Sethu Institute of Technology data
npm run seed

# 5. Start development servers (Backend on :5000, Frontend on :5173)
npm run dev
```

### Pre-configured Demo Accounts
Use the one-click **Demo Switcher** in the top navigation bar or log in manually:

| Role | Username | Password | Notes |
|---|---|---|---|
| **Student** | `karthik_csd` | `sethu123` | 3rd Year Computer Science & Design, AI & UX enthusiast |
| **Faculty** | `dr_ramanathan` | `sethu123` | Professor & HOD, Computer Science & Engineering |
| **Moderator** | `priya_mod` | `sethu123` | SIT Technical Club & Communities Lead |
| **Admin** | `admin_sethu` | `sethu123` | Institutional Administrator |

---

## 📄 License & Institutional Context
Built for **Sethu Institute of Technology**, Pulloor, Kariapatti, Virudhunagar / Madurai, Tamil Nadu, India.
All seed data is fictional and designated as **Demo Data** for demonstration purposes.

