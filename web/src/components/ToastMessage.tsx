'use client';

import { ToastType, useToastMessageStore } from '@/store';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const MessageVariants = cva(
  'flex items-center justify-between rounded shadow py-2 px-4 rounded shadow',
  {
    variants: {
      type: {
        [ToastType.SUCCESS]: 'bg-green-100 text-green-800',
        [ToastType.ERROR]: 'bg-red-100 text-red-800',
        [ToastType.INFO]: 'bg-white text-current',
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
    <div className="fixed flex flex-col gap-4 top-10 right-10 z-50">
      {[...messages].reverse().map((message) => (
        <div
          key={message.uuid}
          className={cn(MessageVariants({ type: message.type }))}
        >
          <span>{message.text}</span>
          <Button
            variant="ghost"
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
