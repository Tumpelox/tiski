import { z } from 'zod';

export const AllowedImageTypes = [
  'image/jpeg',
  'image/svg+xml',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

const imageSchema = z.object({
  image: z.object({
    data: z.instanceof(File),
    type: z.string().refine((type) => AllowedImageTypes.includes(type), {
      message:
        'Tiedostotyyppi ei ole sallittu. Kuvan tulee olla jpg, jpeg, png, webp, gif tai svg',
    }),
    fileName: z.string().min(1, { message: 'Tiedostonimi vaaditaan' }),
  }),
  alt: z.string().min(1, { message: 'Kuvaus vaaditaan' }),
});

export default imageSchema;
