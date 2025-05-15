import { z } from 'zod';

export const codeSchema = z
  .string()
  .min(3, { message: 'Koodi on vähintään 3 merkkiä' })
  .max(36, { message: 'Koodi on enintään 36 merkkiä' })
  .regex(/^[a-zA-Z0-9_.-]*$/, {
    message: 'Koodissa saa olla vain aakkosia ja numeroita',
  });

const availableOrdersSchema = z.coerce
  .number({ message: 'Kentän tulee olla numero.' })
  .int({ message: 'Kentässä tulee olla kokonaisluku.' })
  .positive({ message: 'Tilaukset tulee olla positiivinen luku.' })
  .min(1, { message: 'Vähintään yksi tilaus vaaditaan.' })
  .max(100, { message: 'Maksimi tilausmäärä on 100.' });
const nameSchema = z
  .string()
  .min(1, { message: 'Nimi vaaditaan.' })
  .max(128, { message: 'Nimi voi olla enintään 128 merkkiä.' });

export const createCodeSchema = z.object({
  name: nameSchema,
  code: codeSchema,
  availableOrders: availableOrdersSchema,
});

export const updateCodeSchema = z.object({
  $id: codeSchema,
  name: nameSchema.optional(),
  code: codeSchema.optional(),
  availableOrders: availableOrdersSchema.optional(),
  isActive: z.boolean().optional(),
});
