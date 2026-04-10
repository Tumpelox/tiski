'use client';

import { updateFeed, uploadFeed } from '@/actions/feed';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import feedSchema from '@/schemas/feed.schema';
import imageSchema from '@/schemas/image.schema';

import { ToastType, useToastMessageStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import ImageWithRemove from './ImageWithRemove';
import UploadImage from './UploadImage';
import { PictureDocument } from '@/interfaces/picture.interface';

const UploadFeed = ({
  id,
  text,
  images,
}: {
  id?: string;
  text?: string;
  images?: PictureDocument[];
}) => {
  const addMessage = useToastMessageStore((state) => state.addMessage);

  const router = useRouter();

  const form = useForm<z.infer<typeof feedSchema>>({
    resolver: zodResolver(feedSchema),
    defaultValues: {
      id,
      text: text || '',
      images: [],
      existingImages: images?.map((image) => image.$id) || [],
    },
  });

  const onSubmit = async (values: z.infer<typeof feedSchema>) => {
    let response;

    if (text !== undefined && images !== undefined && id !== undefined) {
      response = await updateFeed(values);
    } else {
      response = await uploadFeed(values);
    }

    const { message, type } = response;
    addMessage(message, type);
    if (type === 'success') {
      if (id === undefined) form.reset();
      router.refresh();
    }
  };

  const removeImage = (id: string) => {
    try {
      const current = form.getValues('existingImages') || [];
      form.setValue(
        'existingImages',
        current.filter((imageId) => imageId !== id)
      );
      return { message: 'Kuva poistettu', type: ToastType.SUCCESS };
    } catch (e) {
      return { message: String(e), type: ToastType.ERROR };
    }
  };

  const removeUpload = (id: string) => {
    try {
      const current = form.getValues('images') || [];
      form.setValue('images', current.toSpliced(Number(id), 1));
      return { message: 'Kuva poistettu', type: ToastType.SUCCESS };
    } catch (e) {
      return { message: String(e), type: ToastType.ERROR };
    }
  };

  const uploadImage = (image: z.infer<typeof imageSchema>) => {
    try {
      const current = form.getValues('images') || [];
      form.setValue('images', [
        { alt: image.alt, file: image.file },
        ...current,
      ]);
      return { message: 'Kuva lisätty', type: ToastType.SUCCESS };
    } catch (e) {
      return { message: String(e), type: ToastType.ERROR };
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="existingImages"
              render={({ field }) => (
                <>
                  {(field.value || []).map((imageId, index) => {
                    const image =
                      images?.find((img) => img.$id === imageId) || null;

                    if (!image) return null;

                    return (
                      <ImageWithRemove
                        key={index}
                        id={imageId}
                        src={image.src}
                        width={image.width}
                        height={image.height}
                        alt={image.alt}
                        removeFile={removeImage}
                      />
                    );
                  })}
                </>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <>
                  {(field.value || []).map((file, index) => {
                    const imgSrc = URL.createObjectURL(file.file.data);
                    return (
                      <ImageWithRemove
                        key={index}
                        id={String(index)}
                        src={imgSrc}
                        alt={file.alt}
                        removeFile={removeUpload}
                      />
                    );
                  })}
                </>
              )}
            />
          </div>
          <UploadImage uploadImage={uploadImage} />
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teksti</FormLabel>
                <FormControl>
                  <Textarea {...field} />
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
    </>
  );
};

export default UploadFeed;
