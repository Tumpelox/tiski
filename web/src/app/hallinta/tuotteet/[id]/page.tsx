import { Heading } from '@/components/Text';

import { getLoggedInUser } from '@/services/userSession';
import isAdmin from '@/lib/isAdmin';
import { getDocument } from '@/services/databases';
import { notFound } from 'next/navigation';
import CreateProduct from '../uusi/CreateProduct';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  ProductDatabase,
  ProductDocument,
} from '@/interfaces/product.interface';
import { PictureDocument } from '@/interfaces/picture.interface';

interface Props {
  params: Promise<{ id: string }>;
}

const UusiFeedPage = async ({ params }: Props) => {
  const { user } = await getLoggedInUser();

  const { id } = await params;

  const { data } = await getDocument<ProductDocument>(
    ProductDatabase.DatabaseId,
    ProductDatabase.CollectionId,
    id
  );

  if (!data) notFound();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center w-full">
        <Heading.h1>Muokkaa tuotetta</Heading.h1>
        <Link
          href={'/hallinta/tuotteet'}
          className={buttonVariants({ variant: 'default' })}
        >
          Takaisin <ArrowLeft className="size-4" />
        </Link>
      </div>
      {isAdmin(user) && (
        <div className="mb-4">
          <CreateProduct
            id={data.$id}
            title={data.title}
            stock={String(data.stock)}
            description={data.description}
            available={data.available}
            hidden={data.hidden}
            pictures={data.pictures as PictureDocument[]}
          />
        </div>
      )}
    </div>
  );
};

export default UusiFeedPage;
