'use client';

import { removeFeed } from '@/actions/feed';
import MarkdownToHtml from '@/components/MarkdownToHtml';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FeedDocument } from '@/interfaces/feed.interface';
import { useToastMessageStore } from '@/store';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Julkaisu = ({ julkaisu }: { julkaisu: FeedDocument }) => {
  const addMessage = useToastMessageStore((state) => state.addMessage);
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const handleRemove = async () => {
    setLoading(true);

    const { message, type } = await removeFeed(julkaisu.$id);

    addMessage(message, type);

    setLoading(false);

    router.refresh();
  };
  return (
    <div className="relative">
      <Link href={`/hallinta/julkaisut/${julkaisu.$id}`}>
        <div className="flex flex-col gap-4 w-full min-h-fit h-full rounded-md bg-[#f0f0f0] px-2 py-4">
          {julkaisu.images.length > 0 && (
            <Image
              key={julkaisu.images[0].$id}
              src={julkaisu.images[0].src}
              alt={julkaisu.images[0].alt}
              width={julkaisu.images[0].width}
              height={julkaisu.images[0].height}
              className="w-full rounded"
            />
          )}

          <div className="grow">
            <MarkdownToHtml markdown={julkaisu.text} />
          </div>
        </div>
      </Link>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={'destructive'}
            className="absolute top-2 right-2"
            size={'sm'}
            disabled={isLoading}
          >
            <X />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Haluatko varmasti poistaa tämän julkaisun?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'outline'}>Peruuta</Button>
            </DialogClose>{' '}
            <Button
              variant={'destructive'}
              onClick={() => handleRemove()}
              disabled={isLoading}
            >
              Poista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Julkaisu;
