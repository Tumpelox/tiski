'use client';

import { uploadImage } from '@/actions/storage';
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
import fileReader from '@/lib/fileReader';
import imageSchema, { AllowedImageTypes } from '@/schemas/image.schema';

import { useToastMessageStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';

const UploadImage = () => {
  const addMessage = useToastMessageStore((state) => state.addMessage);

  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      alt: '',
      image: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof imageSchema>) => {
    const { message, type } = await uploadImage(values);
    addMessage(message, type);
    if (type === 'success') {
      form.reset();
      setIsDialogOpen(false);
      router.refresh();
    }
  };

  const handleFileChange = (fileList: FileList) => {
    const files = fileReader(
      fileList,
      (message: string) => form.setError('image', { type: 'custom', message }),
      AllowedImageTypes
    );

    if (files.length > 1)
      form.setError('image', { type: 'custom', message: 'Vain yksi kuva' });
    else form.setValue('image', files[0]);
  };

  useEffect(() => {
    if (!isDialogOpen) {
      form.reset();
    }
  }, [isDialogOpen, form]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Lisää kuva</Button>
      </DialogTrigger>
      <DialogContent className="w-96 p-4">
        <DialogHeader>
          <DialogTitle>Lisää kuva</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Tiedosto</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/jpg,image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) handleFileChange(files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuvaus</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Lähetetään...' : 'Lähetä'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadImage;
