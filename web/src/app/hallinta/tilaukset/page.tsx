import { listDocuments } from '@/services/databases';
import TilauksetTable from './TilauksetTable';
import { Order, OrderDatabase } from '@/interfaces/order.interface';
import { redirect } from 'next/navigation';
import { Heading } from '@/components/Text';
import { Card, CardContent } from '@/components/ui/card';
import { Query } from 'node-appwrite';
import { z } from 'zod';
import DownloadAll from './DownloadAll';

const searchParamsSchema = z.object({
  size: z.string().regex(/^\d+$/).optional(),
  page: z.string().regex(/^\d+$/).optional(),
  contains: z
    .string()
    .regex(/^[a-zA-Z0-9_.-]*$/)
    .optional(),
  status: z.enum(['waiting', 'shipped', 'canceled']).optional(),
});

interface Params {
  searchParams: Promise<z.infer<typeof searchParamsSchema>>;
}

const getDocumentsByPage = async (
  page: number,
  size: number,
  status: 'waiting' | 'shipped' | 'canceled' | null = null,
  contains: string | null = null
) => {
  const queries: string[] = [
    Query.limit(size),
    Query.offset((page - 1) * size),
    Query.select(['$id', 'orderShipped', 'orderCanceled', 'orderHandler']),
  ];

  if (contains) {
    queries.push(Query.search('$id', contains));
  }

  if (!status) queries.push(Query.isNull('orderCanceled'));

  if (status === 'shipped') queries.push(Query.isNotNull('orderShipped'));

  if (status === 'canceled') queries.push(Query.isNotNull('orderCanceled'));

  if (status === 'waiting')
    queries.push(Query.isNull('orderShipped'), Query.isNull('orderCanceled'));
  console.log('Queries:', queries);
  const response = await listDocuments<Order>(
    OrderDatabase.DatabaseId,
    OrderDatabase.CollectionId,
    queries
  );

  return response;
};

const TilauksetPage = async (params: Params) => {
  const searchParams = searchParamsSchema.safeParse(await params.searchParams);

  const {
    size = '25',
    page = '1',
    status = null,
    contains = null,
  } = searchParams.success
    ? searchParams.data
    : { size: '25', page: '1', status: null, contains: null };

  const { data, total } = await getDocumentsByPage(
    parseInt(page),
    parseInt(size),
    status,
    contains
  );

  if (!data) redirect('/');

  return (
    <div className="space-y-4">
      <Heading.h1>Listaus tilauksista</Heading.h1>
      <Card>
        <CardContent>
          <TilauksetTable orders={data} total={total} />
        </CardContent>
      </Card>
      <DownloadAll />
    </div>
  );
  // return (
  //   <div>
  //     <h1>Listaus tilauksista</h1>
  //     <p>
  //       Esimerkki: <Link href={`/hallinta/tilaukset/1234`}>1234</Link>
  //     </p>
  //     <p>
  //       <strong>Vain adminilla</strong>
  //     </p>
  //     <ul>
  //       <li>Tilausnumero</li>
  //       <li>Linkki tilauksen tietoihin</li>
  //       <li>Haku tilausnumerolla</li>
  //       <li>Tilausten filtteröinti tilan mukaan</li>
  //       <li>Tilausten pdf tulostus ilman yhteystietoja</li>
  //     </ul>
  //   </div>
  // );
};

export default TilauksetPage;
