'use client';

import { loginWithEmailAndPasword } from '@/actions/auth';
import { ToastType, useToastMessageStore } from '@/store';
import { redirect } from 'next/navigation';
import { emailAndPassword } from '@/schemas/auth.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const LoginWithEmailAndPassword = () => {
  const { addMessage } = useToastMessageStore();

  const form = useForm<z.infer<typeof emailAndPassword>>({
    resolver: zodResolver(emailAndPassword),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof emailAndPassword>) => {
    const results = await loginWithEmailAndPasword(values);

    if (results) {
      addMessage(results.message, results.type);
      if (results.type === ToastType.SUCCESS) {
        redirect(`/hallinta`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Kirjaudu</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sähköposti</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salasana</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant={'ghost'}
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Kirjaudutaan...' : 'Kirjaudu'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginWithEmailAndPassword;
