import { Order, OrderDatabase } from '@/interfaces/order.interface';
import { getDocument } from '@/services/databases';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Product } from '@/interfaces/product.interface';
import { Badge } from '@/components/ui/badge'; // Assuming Badge component exists for status
import { Bundle } from '@/interfaces/bundle.interface';
import Title from '@/components/Title';

interface Props {
  params: Promise<{ orderId: string }>;
}

const TilausYhteenvetoPage = async ({ params }: Props) => {
  const { orderId } = await params;

  const { data } = await getDocument<Order>(
    OrderDatabase.DatabaseId,
    OrderDatabase.CollectionId,
    orderId
  );

  if (!data) notFound();

  const getStatusVariant = (
    shipped: Date | null,
    canceled: Date | null
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (shipped) return 'default'; // Or 'success' if you have it
    if (canceled) return 'destructive';
    return 'secondary'; // Pending
  };

  const getStatusText = (
    shipped: Date | null,
    canceled: Date | null
  ): string => {
    if (shipped) return `Lähetetty ${new Date(shipped).toLocaleDateString()}`;
    if (canceled) return `Peruttu ${new Date(canceled).toLocaleDateString()}`;
    return 'Odottaa käsittelyä';
  };

  return (
    <Card className="max-w-4xl mx-auto my-4">
      <CardHeader>
        <Title.h3>Tilaus #{data.$id}</Title.h3>
        <CardDescription>
          Tilauskoodi: {data.orderCode?.code || 'N/A'} | Tilauspvm:{' '}
          {new Date(data.$createdAt).toLocaleDateString()}
        </CardDescription>
        <Badge variant={getStatusVariant(data.shipped, data.canceled)}>
          {getStatusText(data.shipped, data.canceled)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.contacts?.name !== undefined && (
          <section>
            <h2 className="text-lg font-semibold mb-2">Yhteystiedot</h2>
            <p>
              <strong>Nimi:</strong> {data.contacts.name}
            </p>
            <p>
              <strong>Osoite:</strong> {data.contacts.address}
            </p>
          </section>
        )}

        {data.products && data.products.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-2">Tuotteet</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tuote</TableHead>
                  <TableHead>ID</TableHead>
                  {/* Add more relevant product columns if needed */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.products.map((product: Product) => (
                  <TableRow key={product.$id}>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.$id}</TableCell>
                    {/* Add more cells */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        )}
        {data.bundles && data.bundles.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-2">Tuotepaketit</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tuote</TableHead>
                  <TableHead>ID</TableHead>
                  {/* Add more relevant product columns if needed */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.bundles.map((bundle: Bundle) => (
                  <TableRow key={bundle.$id}>
                    <TableCell>{bundle.title}</TableCell>
                    <TableCell>{bundle.$id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        )}

        {data.notes && (
          <section>
            <h2 className="text-lg font-semibold mb-2">Lisätiedot</h2>
            <p className="text-sm text-muted-foreground">{data.notes}</p>
          </section>
        )}
      </CardContent>
      {/* Potentially add CardFooter for actions like Mark as Shipped, Cancel, etc. */}
    </Card>
  );
};

export default TilausYhteenvetoPage;
