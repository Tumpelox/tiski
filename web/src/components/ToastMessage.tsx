'use client';

import { ToastType, useToastMessageStore } from '@/store';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const MessageVariants = cva(
  'relative z-50 flex items-center justify-between gap-4 rounded shadow py-2 px-4 rounded shadow w-fit max-w-full text-wrap',
  {
    variants: {
      type: {
        [ToastType.SUCCESS]: 'bg-background text-foreground',
        [ToastType.ERROR]: 'bg-destructive text-white',
        [ToastType.INFO]: 'bg-accent text-accent-foreground',
      },
    },
    defaultVariants: {
      type: ToastType.INFO,
    },
  }
);

const toastMessageDuration = 10000; // millisekunttia

const ToastMessage = () => {
  const { messages, removeMessage } = useToastMessageStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length > 0) {
        removeMessage(messages[0].uuid);
      }
    }, toastMessageDuration);

    return () => clearTimeout(timer);
  }, [messages, removeMessage]);

  return (
    <div className="fixed flex flex-col gap-4 items-end px-4 sm:px-8 right-0 top-10 z-50 w-fit max-w-full">
      {[...messages].reverse().map((message) => (
        <div
          key={message.uuid}
          className={cn(MessageVariants({ type: message.type }))}
        >
          <span>{message.text}</span>
          <Button
            variant="default"
            className=""
            onClick={() => removeMessage(message.uuid)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ToastMessage;

export const NewToastMessage = () => {
  const [input, setInput] = useState('');
  const { addMessage } = useToastMessageStore();

  return (
    <input
      className="fixed bottom-10 right-10 bg-white rounded shadow py-2 px-4 z-50"
      type="text"
      onChange={(e) => setInput(e.target.value ?? '')}
      onBlur={() => addMessage(input, ToastType.INFO)}
    />
  );
};
