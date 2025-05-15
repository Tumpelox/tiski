import { Order, OrderDatabase } from '@/interfaces/order.interface';
import { getDocument } from '@/services/databases';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Heading, Paragraph } from '@/components/Text';

interface Props {
  params: Promise<{ order: string }>;
}

const TilausYhteenvetoPage = async ({ params }: Props) => {
  const { order } = await params;

  const { data, error } = await getDocument<Order>(
    OrderDatabase.DatabaseId,
    OrderDatabase.CollectionId,
    order
  );

  if (error || !data) notFound();

  const { orderItems, orderNotes, orderShipped, orderCanceled, $id } = data;

  const getStatusBadge = () => {
    if (orderCanceled) {
      return <Badge variant="destructive">Peruttu</Badge>;
    }
    if (orderShipped) {
      return <Badge variant="secondary">Toimitettu</Badge>;
    }
    return <Badge>Käsittelyssä</Badge>;
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Heading.h1 className="text-2xl">Tilauksen tiedot</Heading.h1>
              <Paragraph>Tilausnumero: {$id}</Paragraph>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {orderItems && orderItems.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-2">Tuotteet</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tuote</TableHead>
                    <TableHead>Tuotteen kuvaus</TableHead>
                    <TableHead>Määrä</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((orderItem) => {
                    const product = orderItem.product ?? orderItem.bundle;
                    if (!product) return null;
                    return (
                      <TableRow key={orderItem.$id}>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{orderItem.quantity}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </section>
          )}

          {orderNotes && (
            <section>
              <h2 className="text-lg font-semibold mb-2">Lisätiedot</h2>
              <p>{orderNotes}</p>
            </section>
          )}

          <section className="space-y-1">
            {orderShipped && (
              <p>
                <strong>Toimitettu:</strong>{' '}
                {new Date(orderShipped).toLocaleDateString()}
              </p>
            )}
            {orderCanceled && (
              <p>
                <strong>Peruttu:</strong>{' '}
                {new Date(orderCanceled).toLocaleDateString()}
              </p>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default TilausYhteenvetoPage;
