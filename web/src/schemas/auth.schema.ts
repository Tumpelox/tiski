import { z } from 'zod';

export const emailAndPassword = z.object({
  email: z.string().email({ message: 'Virheellinen sähköpostiosoite' }),
  password: z
    .string()
    .min(8, { message: 'Salasana on vähintään 8 merkkiä pitkä' })
    .max(64, { message: 'Salasana on enintään 64 merkkiä pitkä' }),
});

export const codeSchema = z
  .string()
  .min(3, { message: 'Koodi on vähintään 3 merkkiä' })
  .max(16, { message: 'Koodi on enintään 16 merkkiä' })
  .regex(/^[a-zA-Z0-9]+$/, {
    message: 'Koodissa saa olla vain aakkosia ja numeroita',
  });

export const orderCodeSchema = z.object({
  code: codeSchema,
});
