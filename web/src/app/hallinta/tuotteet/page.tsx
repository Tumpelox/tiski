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

const TuotteetPage = async () => {
  // const { user } = await getLoggedInUser();

  const { data } = await listDocuments<ProductDocument>(
    ProductDatabase.DatabaseId,
    ProductDatabase.CollectionId
  );

  if (!data) redirect('/');

  return (
    <div className="space-y-4">
      <Heading.h1>Tuotteet</Heading.h1>
      <Card>
        <CardContent>
          <TuotteetTable products={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TuotteetPage;
