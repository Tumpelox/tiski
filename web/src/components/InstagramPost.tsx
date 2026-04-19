'use client';

import MarkdownToHtml from '@/components/MarkdownToHtml';
import { Button } from '@/components/ui/button';

import { FeedDocument } from '@/interfaces/feed.interface';

import { useState } from 'react';
import ImageGallery from './ImageGallery';

const InstagramPost = ({ post }: { post: FeedDocument }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mb-6">
      <div className="flex flex-col gap-4 w-full min-h-fit h-full">
        <ImageGallery images={post.images} />
        <div className="grow px-4 bg-card text-card-foreground rounded-md pt-4 pb-2 text-sm">
          <MarkdownToHtml
            markdown={
              open ? post.text : String(post.text).slice(0, 250) + `...\n`
            }
          />
          {String(post.text).length > 250 && (
            <Button
              variant={'ghost'}
              className={'float-end text-lg bg-none underline'}
              onClick={() => setOpen(!open)}
            >
              {open ? 'sulje' : '...lue lisää'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstagramPost;
