export type LogLevel = 'info' | 'warn' | 'error' | 'security' | 'ai';

export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta ? JSON.stringify(meta) : '');
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta ? JSON.stringify(meta) : '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error instanceof Error ? error.message : error || '');
  },
  security: (event: string, meta?: any) => {
    console.warn(`[SECURITY_AUDIT] ${new Date().toISOString()} - ${event}`, meta ? JSON.stringify(meta) : '');
  },
  ai: (agent: string, action: string, meta?: any) => {
    console.log(`[AI_ORCHESTRATOR:${agent}] ${new Date().toISOString()} - ${action}`, meta ? JSON.stringify(meta) : '');
  }
};

