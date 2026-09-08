import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50),
  department: z.string().min(2, 'Department is required'),
  year: z.number().int().min(1).max(5).optional(),
  role: z.enum(['student', 'faculty', 'moderator', 'admin']).optional().default('student')
});

export const loginSchema = z.object({
  login: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  bio: z.string().max(300).optional(),
  department: z.string().optional(),
  year: z.number().int().min(1).max(5).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  isPrivate: z.boolean().optional()
});

