import { Heading } from '@/components/Text';
import { Card, CardContent } from '@/components/ui/card';
import {
  ProductDatabase,
  ProductDocument,
} from '@/interfaces/product.interface';
import { listDocuments } from '@/services/databases';
// import { getLoggedInUser } from "@/services/userSession";
import { redirect } from 'next/navigation';
import TuotteetTable from './TuotteetTable';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

const TuotteetPage = async () => {
  // const { user } = await getLoggedInUser();

  const { data } = await listDocuments<ProductDocument>(
    ProductDatabase.DatabaseId,
    ProductDatabase.CollectionId
  );

  if (!data) redirect('/');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center w-full">
        <Heading.h1>Tuotteet</Heading.h1>
        <Link
          href={'/hallinta/tuotteet/uusi'}
          className={buttonVariants({ variant: 'default' })}
        >
          Luo uusi tuote <Plus className="size-4" />
        </Link>
      </div>

      <TuotteetTable products={data} />
    </div>
  );
};

export default TuotteetPage;
