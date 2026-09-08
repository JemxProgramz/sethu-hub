import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimit } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

// Route Handlers
import { authRouter } from './api/auth.routes.js';
import { postsRouter } from './api/posts.routes.js';
import { commentsRouter } from './api/comments.routes.js';
import { communitiesRouter } from './api/communities.routes.js';
import { projectsRouter } from './api/projects.routes.js';
import { pollsRouter } from './api/polls.routes.js';
import { eventsRouter } from './api/events.routes.js';
import { searchRouter } from './api/search.routes.js';
import { aiRouter } from './api/ai.routes.js';
import { usersRouter } from './api/users.routes.js';
import { notificationsRouter } from './api/notifications.routes.js';
import { moderatorRouter } from './api/moderator.routes.js';
import { adminRouter } from './api/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// 1. Security & CORS
app.use(cors({
  origin: [CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5000', 'http://127.0.0.1:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Body Parser
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// 3. Global Rate Limiter
app.use(rateLimit({ windowMs: 60 * 1000, max: 240 }));

// 4. Request Logger
app.use((req, _res, next) => {
  if (req.url !== '/api/v1/health') {
    logger.info(`${req.method} ${req.url}`);
  }
  next();
});

// 5. API Health Check
app.get('/api/v1/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      platform: 'Sethu Hub',
      institution: 'Sethu Institute of Technology',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  });
});

// 6. Mount API Routes (/api/v1/...)
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1', commentsRouter);
app.use('/api/v1/communities', communitiesRouter);
app.use('/api/v1/projects', projectsRouter);
app.use('/api/v1/polls', pollsRouter);
app.use('/api/v1/events', eventsRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/moderator', moderatorRouter);
app.use('/api/v1/admin', adminRouter);

// 7. Static Frontend Assets (if built)
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '..', 'frontend', 'dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 8. Centralized Error Handler
app.use(errorHandler);

// Start HTTP Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n🚀 SETHU HUB Backend API running at http://localhost:${PORT}`);
    console.log(`📡 API Base Endpoint: http://localhost:${PORT}/api/v1`);
    console.log(`🌐 Web Client Available at: http://localhost:${PORT}`);
    console.log(`🎓 Institutional Context: Sethu Institute of Technology\n`);
  });
}

export default app;
