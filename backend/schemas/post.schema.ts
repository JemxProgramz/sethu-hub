import { z } from 'zod';

export const createPostSchema = z.object({
  communityId: z.string().min(1, 'Community is required'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title cannot exceed 200 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters').max(10000),
  postType: z.enum([
    'discussion',
    'question',
    'project',
    'opportunity',
    'event',
    'announcement',
    'poll',
    'showcase'
  ]).default('discussion'),
  tags: z.array(z.string()).max(10).optional().default([]),
  metadata: z.record(z.any()).optional().default({})
});

export const voteSchema = z.object({
  voteValue: z.union([z.literal(1), z.literal(-1), z.literal(0)])
});

