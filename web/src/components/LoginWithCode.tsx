'use client';

import { handleCodeLogin } from '@/actions/auth';
import { Button } from './ui/button';
import { useToastMessageStore } from '@/store';
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

export const LoginWithCode = () => {
  const { addMessage } = useToastMessageStore();

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
              <FormLabel htmlFor="code" className="block mb-1 font-medium">
                Syötä koodi:
              </FormLabel>
              <FormControl>
                <Input
                  id="code"
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-describedby="code-error"
                  {...field}
                />
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
