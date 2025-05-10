import { z } from 'zod';

const orderSchema = z.object({
  products: z.array(z.string()),
  bundles: z.array(z.string()),
  shippingName: z.string().min(2, { message: 'Nimi vaaditaan' }),
  shippingAddress: z.string().min(5, { message: 'Osoite vaaditaan' }),
  notes: z.string().max(1024, { message: 'Liian pitkä lisätieto' }).optional(),
});

export default orderSchema;
