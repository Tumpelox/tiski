'use client';

import { removeImage } from '@/actions/storage';
import { Button } from '@/components/ui/button';
import { Picture } from '@/interfaces/picture.interface';
import { useToastMessageStore } from '@/store';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useState } from 'react';

interface ImageWithRemoveProps extends Picture {
  $id: string;
}

const ImageWithRemove = ({
  $id,
  src,
  width,
  height,
  alt,
}: ImageWithRemoveProps) => {
  const [loading, setLoading] = useState(false);
  const addMessage = useToastMessageStore((state) => state.addMessage);
  const router = useRouter();

  const handleRemove = async () => {
    setLoading(true);
    const { message, type } = await removeImage($id);
    addMessage(message, type);
    if (type === 'success') {
      router.refresh();
    }
    setLoading(false);
  };
  return (
    <div key={src} className="relative">
      <Image src={src} width={width} height={height} alt={alt} />
      <Button
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
