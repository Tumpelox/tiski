import { Heading } from '@/components/Text';
import { listDocuments } from '@/services/databases';

import { redirect } from 'next/navigation';
import { FeedDatabase, FeedDocument } from '@/interfaces/feed.interface';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Query } from 'node-appwrite';
import { Plus } from 'lucide-react';

import Julkaisu from './Julkaisu';

const KuvatPage = async () => {
  const { data } = await listDocuments<FeedDocument>(
    FeedDatabase.DatabaseId,
    FeedDatabase.CollectionId,
    [Query.select(['$id', 'text', 'images.*'])]
  );

  if (!data) redirect('/');

  return (
    <div className="space-y-4">
      <Heading.h1>Julkaisut</Heading.h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((julkaisu) => (
          <Julkaisu key={julkaisu.$id} julkaisu={julkaisu} />
        ))}
      </div>
      <Link
        href={'/hallinta/julkaisut/uusi'}
        className={buttonVariants({ variant: 'default' })}
      >
        Luo uusi julkaisu <Plus className="size-4" />
      </Link>
    </div>
  );
};

export default KuvatPage;
