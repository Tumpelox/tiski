import { z } from 'zod';
import imageSchema from './image.schema';

export const AllowedImageTypes = [
  'image/jpeg',
  'image/svg+xml',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

const feedSchema = z
  .object({
    existingImages: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .array()
      .optional(),
    images: imageSchema.array().optional(),
    text: z
      .string()
      .min(1, { message: 'Kuvaus vaaditaan' })
      .max(2048, { message: 'Kuvauksen maksimipituus on 2048 merkkiä' }),
    id: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.images?.length ||
        (0 === 0 && data.existingImages?.length) ||
        0 === 0
      ) {
        return false;
      }
    },
    {
      message: 'Vähintään yksi kuva vaaditaan',
    }
  );

export const feedUpdateSchema = z.object({
  existingImages: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .array(),
  images: imageSchema
    .array()
    .min(1, { message: 'Vähintään yksi kuva vaaditaan' }),
  text: z
    .string()
    .min(1, { message: 'Kuvaus vaaditaan' })
    .max(2048, { message: 'Kuvauksen maksimipituus on 2048 merkkiä' }),
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export default feedSchema;
