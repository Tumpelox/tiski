'use client';

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
import { ToastType, useToastMessageStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirect } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useReCaptcha } from 'next-recaptcha-v3';
import { z } from 'zod';

import { feedbackSchema } from '@/schemas/feedback.schema';
import { sendFeedback } from '@/actions/feedback';
import { Card, CardContent } from './ui/card';

const FeedbackForm = () => {
  const { addMessage } = useToastMessageStore();
  const { executeRecaptcha } = useReCaptcha();

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedbackName: '',
      feedbackMessage: '',
      recaptchaToken: '123',
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof feedbackSchema>) => {
    const recaptchaToken = await executeRecaptcha('feedback_submit');

    if (!recaptchaToken) {
      addMessage('Palautteen lähetys epäonnistui', ToastType.ERROR);
      return;
    }

    const order = await sendFeedback({ ...values, recaptchaToken });

    if (order) {
      addMessage(order.message, order.type);
      if (order.type === ToastType.SUCCESS) {
        redirect(`/sivut/kiitos-palautteesta`);
      }
    }
  };

  // const totalItems = getTotalItems();

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="feedbackName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nimimerkki</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="name" />
                  </FormControl>
                  <FormDescription>
                    Palautteesi yhteydessä näkyvä nimimerkki
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedbackMessage"
              render={({ field }) => (
                <FormItem className="sm:col-span-6">
                  <FormLabel>Viesti</FormLabel>
                  <FormControl>
                    <Textarea {...field} autoComplete="street-address" />
                  </FormControl>
                  <FormDescription>
                    Mitä ajatuksia toimintamme on sinussa herättänyt. Koskettiko
                    jokin tarra sinua erityisesti?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:flex justify-between items-center">
              <CloudButton
                small
                type="submit"
                disabled={form.formState.isSubmitting}
                className="float-right"
              >
                {form.formState.isSubmitting ? 'Lähetetään...' : 'LÄHETÄ'}
              </CloudButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
