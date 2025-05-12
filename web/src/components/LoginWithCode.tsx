'use client';

import { handleCodeLogin } from '@/actions/auth';
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
import CloudButton from './CloudButton';

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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 items-center"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel htmlFor="code">Koodi</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Syötä saamasi tilauskoodi</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <CloudButton
          button={{ type: 'submit', disabled: form.formState.isSubmitting }}
          backgroundColor="var(--violetti)"
          className="text-white"
          small
        >
          {form.formState.isSubmitting ? 'Kirjaudutaan...' : 'Kirjaudu'}
        </CloudButton>
      </form>
    </Form>
  );
};

export default LoginWithCode;
