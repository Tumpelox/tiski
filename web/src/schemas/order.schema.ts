import { z } from 'zod';
import { codeSchema } from './orderCode.schema';

const orderSchema = z.object({
  products: z
    .object({
      $id: z.string().min(1, { message: 'Tuote vaaditaan' }),
      quantity: z.number().min(1, { message: 'Määrä vaaditaan' }),
      type: z.enum(['product', 'bundle']),
    })
    .array(),
  shippingName: z.string().min(2, { message: 'Nimi vaaditaan' }),
  shippingAddress: z.string().min(5, { message: 'Osoite vaaditaan' }),
  orderNotes: z
    .string()
    .max(1024, { message: 'Liian pitkä lisätieto' })
    .optional(),
});

export const orderWithMotivationSchema = z.object({
  products: z
    .object({
      $id: z.string().min(1, { message: 'Tuote vaaditaan' }),
      quantity: z.number().min(1, { message: 'Määrä vaaditaan' }),
      type: z.enum(['product', 'bundle']),
    })
    .array(),
  shippingName: z.string().min(2, { message: 'Nimi vaaditaan' }),
  shippingAddress: z.string().min(5, { message: 'Osoite vaaditaan' }),
  shippingPostalCode: z.string().min(3, { message: 'Postinumero vaaditaan' }),
  shippingCity: z.string().min(2, { message: 'Kaupunki vaaditaan' }),
  shippingPhoneNumber: z
    .string()
    .refine((val) => /^\+?[0-9]\d{7,16}$/.test(val.replace(/[\s-()]/g, ''))),
  recaptchaToken: z.string().min(1, { message: 'ReCaptcha vaaditaan' }),
  orderNotes: z
    .string()
    .min(10, { message: 'Pakollinen kenttä' })
    .max(1024, { message: 'Liian pitkä' }),
});

export const updateOrderSchema = z.object({
  $id: codeSchema,
  orderShipped: z.date().nullable().optional(),
  orderCanceled: z.date().nullable().optional(),
});

export default orderSchema;
