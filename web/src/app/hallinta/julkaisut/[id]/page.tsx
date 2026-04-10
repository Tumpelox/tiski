import { Heading } from '@/components/Text';

import { getLoggedInUser } from '@/services/userSession';
import isAdmin from '@/lib/isAdmin';
import { getDocument } from '@/services/databases';
import { FeedDatabase, FeedDocument } from '@/interfaces/feed.interface';
import { notFound } from 'next/navigation';
import UploadFeed from '../uusi/UploadFeed';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

const UusiFeedPage = async ({ params }: Props) => {
  const { user } = await getLoggedInUser();

  const { id } = await params;

  const { data } = await getDocument<FeedDocument>(
    FeedDatabase.DatabaseId,
    FeedDatabase.CollectionId,
    id
  );

  if (!data) notFound();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center w-full">
        <Heading.h1>Muokkaa julkaisua</Heading.h1>
        <Link
          href={'/hallinta/julkaisut'}
          className={buttonVariants({ variant: 'default' })}
        >
          Takaisin <ArrowLeft className="size-4" />
        </Link>
      </div>
      {isAdmin(user) && (
        <div className="mb-4">
          <UploadFeed id={data.$id} text={data.text} images={data.images} />
        </div>
      )}
    </div>
  );
};

export default UusiFeedPage;
