import { Order, OrderDatabase } from '@/interfaces/order.interface';
import { getDocument } from '@/services/databases';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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

  const { products, bundles, notes, shipped, canceled, $id } = data;

  const getStatusBadge = () => {
    if (canceled) {
      return <Badge variant="destructive">Peruttu</Badge>;
    }
    if (shipped) {
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
              <CardTitle>Tilauksen tiedot</CardTitle>
              <CardDescription>Tilausnumero: {$id}</CardDescription>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {products && products.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-2">Tuotteet</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tuote</TableHead>
                    <TableHead>Määrä</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.$id}>
                      <TableCell>{product.title}</TableCell>
                      <TableCell>{product.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          )}

          {bundles && bundles.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-2">Tuotepaketit</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paketti</TableHead>
                    <TableHead>Kuvaus</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bundles.map((bundle) => (
                    <TableRow key={bundle.title}>
                      <TableCell>{bundle.title}</TableCell>
                      <TableCell>{bundle.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          )}

          {notes && (
            <section>
              <h2 className="text-lg font-semibold mb-2">Lisätiedot</h2>
              <p>{notes}</p>
            </section>
          )}

          <section className="space-y-1">
            {shipped && (
              <p>
                <strong>Toimitettu:</strong>{' '}
                {new Date(shipped).toLocaleDateString()}
              </p>
            )}
            {canceled && (
              <p>
                <strong>Peruttu:</strong>{' '}
                {new Date(canceled).toLocaleDateString()}
              </p>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default TilausYhteenvetoPage;
