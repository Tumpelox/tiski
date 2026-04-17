import z from 'zod';
import imageSchema from './image.schema';

export const AllowedImageTypes = [
  'image/jpeg',
  'image/svg+xml',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

const productSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: 'Nimi vaaditaan' })
      .max(128, { message: 'Nimen maksimipituus on 128 merkkiä' }),
    description: z
      .string()
      .min(1, { message: 'Kuvaus vaaditaan' })
      .max(2048, { message: 'Kuvauksen maksimipituus on 2048 merkkiä' })
      .optional(),
    available: z.boolean(),
    stock: z.string().regex(/^\d+$/).optional(),
    hidden: z.boolean(),
    existingImages: z.string().array().optional(),
    pictures: imageSchema.array().optional(),
    id: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
  })
  .refine(
    (data) => {
      if (
        (data.pictures?.length || 0) === 0 &&
        (data.existingImages?.length || 0) === 0
      ) {
        return false;
      } else return true;
    },
    {
      message: 'Vähintään yksi kuva vaaditaan',
    }
  );

export default productSchema;
