import { z } from 'zod';

export const emailAndPassword = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
});

export const orderCodeSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(16)
    .regex(/^[a-zA-Z0-9]+$/),
});
