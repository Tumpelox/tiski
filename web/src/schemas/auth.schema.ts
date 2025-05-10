import { z } from 'zod';
import { codeSchema } from './orderCode.schema';

export const emailAndPassword = z.object({
  email: z.string().email({ message: 'Virheellinen sähköpostiosoite' }),
  password: z
    .string()
    .min(8, { message: 'Salasana on vähintään 8 merkkiä pitkä' })
    .max(64, { message: 'Salasana on enintään 64 merkkiä pitkä' }),
});

export const orderCodeSchema = z.object({
  code: codeSchema,
});
