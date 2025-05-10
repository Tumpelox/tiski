'use client';

import { Button } from '@/components/ui/button';
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

const Order = () => {
  const { items } = useCartStore();
  const addMessage = useToastMessageStore((state) => state.addMessage);

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      products: items
        .filter((item) => item.type === 'product')
        .map((item) => item.$id),
      bundles: items
        .filter((item) => item.type === 'bundle')
        .map((item) => item.$id),
      shippingName: '',
      shippingAddress: '',
      notes: '',
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof orderSchema>) => {
    const order = await newOrder({
      ...values,
      products: items
        .filter((item) => item.type === 'product')
        .map((item) => item.$id),
      bundles: items
        .filter((item) => item.type === 'bundle')
        .map((item) => item.$id),
    });

    if (order) {
      addMessage(order.message, order.type);
      if (order.type === ToastType.SUCCESS) {
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
            name="notes"
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Lähetetään tilausta...' : 'Tilaa'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Order;
