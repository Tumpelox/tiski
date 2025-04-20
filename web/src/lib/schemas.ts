import { z } from 'zod';

export const codeSchema = z
  .string()
  .min(3)
  .max(16)
  .regex(/^[a-zA-Z0-9]+$/);

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8).max(32);
