'use client';

import { newOrderWithOutCode } from '@/actions/order';
import { CloudButton } from '@/components/CloudButton';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { orderWithMotivationSchema } from '@/schemas/order.schema';
import { ToastType, useCartStore, useToastMessageStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirect } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useReCaptcha } from 'next-recaptcha-v3';
import { z } from 'zod';
import { Paragraph } from '@/components/Text';

const Order = () => {
  const { items, clearCart } = useCartStore();
  const { addMessage } = useToastMessageStore();
  const { executeRecaptcha } = useReCaptcha();

  const form = useForm<z.infer<typeof orderWithMotivationSchema>>({
    resolver: zodResolver(orderWithMotivationSchema),
    defaultValues: {
      products: items,
      shippingName: '',
      shippingAddress: '',
      shippingPostalCode: '',
      shippingCity: '',
      shippingPhoneNumber: '',
      orderNotes: '',
      recaptchaToken: '123',
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (
    values: z.infer<typeof orderWithMotivationSchema>
  ) => {
    const recaptchaToken = await executeRecaptcha('submit_order');

    if (!recaptchaToken) {
      addMessage('Tilaus epäonnistui', ToastType.ERROR);
      return;
    }

    const order = await newOrderWithOutCode({
      ...values,
      products: items,
      recaptchaToken,
    });

    if (order) {
      addMessage(order.message, order.type);
      if (order.type === ToastType.SUCCESS) {
        clearCart();
        redirect(`/sivut/hakemus-lahetetty`);
      }
    }
  };

  // const totalItems = getTotalItems();

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="shippingName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tilaajan nimi</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="name" />
                </FormControl>
                <FormDescription>Tilauksessa käytettävä nimi</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 sm:grid-cols-6 sm:grid-rows-2 gap-4">
            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem className="sm:col-span-6">
                  <FormLabel>Katuosoite</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="street-address" />
                  </FormControl>
                  <FormDescription>Tilauksen toimitusosoite</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingPostalCode"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Postikoodi</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="postal-code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingCity"
              render={({ field }) => (
                <FormItem className="sm:col-span-4">
                  <FormLabel>Kunta</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="address-level2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="shippingPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Puhelinnumero</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="mobile tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="orderNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mikä motivoi sinua tilaamaan tarroja?</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  Miksi juuri sinä haluat osallistua tarravaikuttamiseen
                  suviseuroissa?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:flex justify-between items-center">
            <Paragraph>
              Sitoudun että tilaus tehdään suviseuroissa tapahtuvaa
              tarravaikuttamista varten!
            </Paragraph>
            <CloudButton
              small
              type="submit"
              disabled={form.formState.isSubmitting}
              className="float-right"
            >
              {form.formState.isSubmitting ? 'Lähetetään tilausta...' : 'TILAA'}
            </CloudButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Order;
