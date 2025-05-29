'use client';

import { Input } from '@/components/ui/input';
import { useCartStore, useToastMessageStore, ToastType } from '@/store';
import { newOrder } from '@/actions/order';
import { redirect } from 'next/navigation'; // Import useRouter
import { z } from 'zod';
import { Textarea } from '../../../components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import orderSchema from '@/schemas/order.schema';
import { CloudButton } from '@/components/CloudButton';

const Order = () => {
  const { items, clearCart } = useCartStore();
  const { addMessage } = useToastMessageStore();

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      products: items,
      shippingName: '',
      shippingAddress: '',
      orderNotes: '',
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof orderSchema>) => {
    const order = await newOrder({
      ...values,
      products: items,
    });

    if (order) {
      addMessage(order.message, order.type);
      if (order.type === ToastType.SUCCESS) {
        clearCart();
        redirect(`/tilaus/${order.data}`);
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
                  <Input {...field} />
                </FormControl>
                <FormDescription>Tilauksessa käytettävä nimi</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shippingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Osoite</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Tilauksen toimitusosoite</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="orderNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lisätiedot</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  Tilauksen mahdolliset lisätiedot
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <CloudButton
            small
            type="submit"
            disabled={form.formState.isSubmitting}
            className="float-right"
          >
            {form.formState.isSubmitting ? 'Lähetetään tilausta...' : 'TILAA'}
          </CloudButton>
        </form>
      </Form>
    </div>
  );
};

export default Order;
