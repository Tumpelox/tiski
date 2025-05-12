import Cart from '@/components/Cart';
import { getOrderCode } from '@/services/orderCode';
import { getLoggedInUser } from '@/services/userSession';
import Link from 'next/link';
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
import { Button } from '@/components/ui/button';
import { Order } from '@/interfaces/order.interface'; // Import Order interface
import LoginWithCode from '@/components/LoginWithCode';
import { Heading } from '@/components/Text';

const TilausPage = async () => {
  const user = await getLoggedInUser();
  const orderCode = await getOrderCode(user);

  // Explicitly type the order parameter
  const getStatusBadge = (order: Pick<Order, 'shipped' | 'canceled'>) => {
    if (order.canceled) {
      return <Badge variant="destructive">Peruttu</Badge>;
    }
    if (order.shipped) {
      return <Badge variant="secondary">Toimitettu</Badge>;
    }
    return <Badge>Käsittelyssä</Badge>;
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {!orderCode && (
        <Card>
          <CardContent>
            <LoginWithCode />
          </CardContent>
        </Card>
      )}
      {orderCode && (
        <>
          {/* Only render the cart if no orders have been placed */}
          {orderCode.orders.length === 0 && <Cart />}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <Heading.h2>Tilaukset</Heading.h2>
                </div>
                {orderCode && (
                  <Badge variant="outline">
                    Aktiivinen koodi: {orderCode.code}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {orderCode && orderCode.orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tilausnumero</TableHead>
                      <TableHead>Tila</TableHead>
                      <TableHead>Tuotteet</TableHead>
                      <TableHead></TableHead> {/* For the view button */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderCode.orders.map((order) => (
                      <TableRow key={order.$id}>
                        <TableCell className="font-medium">
                          {order.$id}
                        </TableCell>
                        <TableCell>{getStatusBadge(order)}</TableCell>
                        <TableCell>
                          {/* Ensure products exist before mapping */}
                          {order.products?.map((p) => p.title).join(', ')}
                          {/* Ensure bundles exist and add separator conditionally */}
                          {order.products?.length > 0 &&
                            order.bundles?.length > 0 &&
                            ', '}
                          {order.bundles?.map((b) => b.title).join(', ')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/tilaus/${order.$id}`}>
                              Tarkastele
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">
                  {orderCode
                    ? 'Tällä tilauskoodilla ei ole vielä tehty tilauksia.'
                    : 'Kirjaudu sisään tai syötä tilauskoodi nähdäksesi tilaukset.'}
                </p>
              )}
            </CardContent>
            {/* Potential place for code input if user is logged in but no code is active */}
          </Card>
        </>
      )}
    </div>
  );
};

export default TilausPage;
