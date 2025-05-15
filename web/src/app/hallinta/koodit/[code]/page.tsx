import { OrderCode, OrderCodeDatabase } from '@/interfaces/orderCode.interface';
import { getDocument } from '@/services/databases';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Heading, Paragraph } from '@/components/Text';

interface Props {
  params: Promise<{ code: string }>;
}

const KooditPage = async ({ params }: Props) => {
  const { code } = await params;

  const { data } = await getDocument<OrderCode>(
    OrderCodeDatabase.DatabaseId,
    OrderCodeDatabase.CollectionId,
    code
  );

  if (!data) notFound();

  return (
    <Card>
      <CardHeader>
        <Heading.h1 className="text-2xl">
          Tilauskoodin tiedot: {data.name}
        </Heading.h1>
        <Paragraph>Koodi: {data.code}</Paragraph>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Perustiedot</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>Nimi:</div>
            <div>{data.name}</div>
            <div>Koodi:</div>
            <div>{data.code}</div>
            <div>Tekijä:</div>
            <div>{data.userId}</div>
            <div>Maksimimäärä paketteja / tuotteita yhteensä</div>
            <div>{data.availableOrders}</div>
            <div>Aktiivinen:</div>
            <div>
              <Badge variant={data.isActive ? 'default' : 'destructive'}>
                {data.isActive ? 'Kyllä' : 'Ei'}
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mt-4">Koodilla tehdyt tilaukset</h3>
          {data.orders ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tilaus ID</TableHead>
                  <TableHead>Tilaaja</TableHead>
                  <TableHead>Tila</TableHead>
                  <TableHead>Luotu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow key={data.orders.$id}>
                  <TableCell>
                    <Link href={`/hallinta/tilaukset/${data.orders.$id}`}>
                      {data.orders.$id}
                    </Link>
                  </TableCell>
                  <TableCell>{data.orders.orderContacts?.name}</TableCell>
                  <TableCell>
                    {data.orders.orderShipped ? 'Lähetetty' : 'Odottaa'}
                  </TableCell>
                  <TableCell>
                    {new Date(data.orders.$createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <p>Tällä koodilla ei ole vielä tehty tilauksia.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KooditPage;
