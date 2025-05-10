'use client';

import { handleCodeLogin } from '@/actions/auth';
import { Button } from './ui/button';
import { ToastType, useToastMessageStore } from '@/store';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { orderCodeSchema } from '@/schemas/auth.schema';
import { useRouter } from 'next/navigation';

export const LoginWithCode = () => {
  const { addMessage } = useToastMessageStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof orderCodeSchema>>({
    resolver: zodResolver(orderCodeSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof orderCodeSchema>) => {
    const result = await handleCodeLogin(values);

    if (result) {
      addMessage(result.message, result.type);
      if (result.type === ToastType.SUCCESS) {
        router.refresh();
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="code">Koodi</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Syötä saamasi tilauskoodi</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Kirjaudutaan...' : 'Kirjaudu'}
        </Button>
      </form>
    </Form>
  );
};

export default LoginWithCode;
