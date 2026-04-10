'use client';

import { Button } from '@/components/ui/button';
import { ToastType, useToastMessageStore } from '@/store';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useState } from 'react';

interface ImageWithRemoveProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  id: string;
  removeFile: (id: string) => { message: string; type: ToastType };
}

const ImageWithRemove = ({
  src,
  alt,
  width,
  height,
  id,
  removeFile,
}: ImageWithRemoveProps) => {
  const [loading, setLoading] = useState(false);
  const addMessage = useToastMessageStore((state) => state.addMessage);

  const handleRemove = async () => {
    setLoading(true);
    const { message, type } = removeFile(id);
    addMessage(message, type);
    setLoading(false);
  };

  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover w-full aspect-[4/5] rounded-md"
      />
      <Button
        type="button"
        variant={'destructive'}
        className="absolute top-2 right-2"
        size={'sm'}
        onClick={() => handleRemove()}
        disabled={loading}
      >
        <X />
      </Button>
    </div>
  );
};

export default ImageWithRemove;
