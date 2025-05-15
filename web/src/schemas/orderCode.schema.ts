import { z } from 'zod';

export const codeSchema = z
  .string()
  .min(3, { message: 'Koodi on vähintään 3 merkkiä' })
  .max(36, { message: 'Koodi on enintään 36 merkkiä' })
  .regex(/^[a-zA-Z0-9_.-]*$/, {
    message: 'Koodissa saa olla vain aakkosia ja numeroita',
  });

export const createCodeSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Nimi vaaditaan.' })
    .max(128, { message: 'Nimi voi olla enintään 128 merkkiä.' }),
  code: codeSchema,
  availableOrders: z.coerce
    .number({ invalid_type_error: 'Kentän tulee olla numero.' })
    .int({ message: 'Kentässä tulee olla kokonaisluku.' })
    .positive({ message: 'Tilaukset tulee olla positiivinen luku.' })
    .min(1, { message: 'Vähintään yksi tilaus vaaditaan.' })
    .max(100, { message: 'Maksimi tilausmäärä on 100.' }),
});
