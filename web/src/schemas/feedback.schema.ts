import { z } from 'zod';

export const feedbackSchema = z.object({
  feedbackName: z
    .string()
    .min(2, { message: 'Nimimerkki vaaditaan' })
    .max(124, {
      message: 'Nimimerkki voi olla maksimissaan 128 merkkiä pitkä',
    }),
  feedbackMessage: z
    .string()
    .min(2, { message: 'Viesti vaaditaan' })
    .max(2048, { message: 'Viesti voi olla maksimissaan 2048 merkkiä pitkä' }),
  recaptchaToken: z.string().min(1, { message: 'ReCaptcha vaaditaan' }),
});
