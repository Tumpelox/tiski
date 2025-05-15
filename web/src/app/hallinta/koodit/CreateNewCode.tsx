'use client';

import { createNewOrderCode } from '@/actions/orderCode';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createCodeSchema } from '@/schemas/orderCode.schema';
import { ToastType, useToastMessageStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';

const CreateNewCode = () => {
  const addMessage = useToastMessageStore((state) => state.addMessage);
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof createCodeSchema>>({
    resolver: zodResolver(createCodeSchema),
    defaultValues: {
      name: '',
      code: '',
      availableOrders: 1,
    },
  });

  // 3. Define a submit handler
  const onSubmit = async (values: z.infer<typeof createCodeSchema>) => {
    const result = await createNewOrderCode(values);

    if (result) {
      addMessage(result.message, result.type);
      if (result.type === ToastType.SUCCESS) {
        form.reset();
        setIsDialogOpen(false);
        router.refresh();
      }
    }
  };

  useEffect(() => {
    if (!isDialogOpen) {
      form.reset();
    }
  }, [isDialogOpen, form]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Luo uusi koodi</Button>
      </DialogTrigger>
      <DialogContent className="w-96 p-4">
        <DialogHeader>
          <DialogTitle>Luo tilauskoodi</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nimi</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Koodi</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availableOrders"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montako pakettia tilattavissa</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 0)
                      } // Ensure value is number
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Luodaan...' : 'Luo uusi koodi'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewCode;
