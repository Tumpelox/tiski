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
  const [open, setOpen] = useState(false);

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
      <div className="flex flex-col gap-2 w-full min-h-fit h-full">
        <Link href={`/hallinta/julkaisut/${julkaisu.$id}`}>
          {julkaisu.images.length > 0 && (
            <Image
              key={julkaisu.images[0].$id}
              src={julkaisu.images[0].src}
              alt={julkaisu.images[0].alt}
              width={julkaisu.images[0].width}
              height={julkaisu.images[0].height}
              className="w-full rounded-md aspect-[4/5] object-cover"
            />
          )}
        </Link>
        <div className="grow px-4">
          <MarkdownToHtml
            markdown={
              open ? julkaisu.text : String(julkaisu.text).slice(0, 300) + '...'
            }
          />
          {String(julkaisu.text).length > 300 && (
            <Button
              variant={'ghost'}
              className={'float-end text-primary bg-none underline'}
              onClick={() => setOpen(!open)}
            >
              {open ? 'Sulje' : 'lisää'}
            </Button>
          )}
        </div>
      </div>

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
