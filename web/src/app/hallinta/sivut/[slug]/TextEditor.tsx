'use client';

import savePage from '@/actions/page';
import { Button } from '@/components/ui/button';
import { Article } from '@/interfaces/article.interface';
import { ToastType, useToastMessageStore } from '@/store';

import { redirect } from 'next/navigation';
import { useActionState, useEffect } from 'react';

const TextEditor = ({ data }: { data: Article }) => {
  const [message, formAction] = useActionState(savePage, null);
  const { addMessage } = useToastMessageStore();

  useEffect(() => {
    if (message) {
      addMessage(message.message, message.type);
      if (message.type === ToastType.SUCCESS) {
        redirect(`/hallinta/sivut/${data.$id}`);
      }
    }
  }, [message, addMessage, data.$id]);

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <div className="flex flex-col gap-4">
        <label htmlFor="slug" className="text-sm font-medium text-gray-700">
          Slug
        </label>
        <input
          type="text"
          name="slug"
          defaultValue={data.$id}
          className="border rounded-md p-2"
        />

        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={data.title}
          className="border rounded-md p-2"
        />

        <label htmlFor="text" className="text-sm font-medium text-gray-700">
          Text
        </label>
        <textarea
          name="text"
          defaultValue={data.text}
          className="border rounded-md p-2 h-64"
        ></textarea>
      </div>
      <Button type="submit" className="p-2">
        Tallenna
      </Button>
    </form>
  );
};

export default TextEditor;
