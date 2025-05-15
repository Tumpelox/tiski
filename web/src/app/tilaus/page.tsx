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
  const { user } = await getLoggedInUser();
  const orderCode = await getOrderCode(user);

  // Explicitly type the order parameter
  const getStatusBadge = (
    order: Pick<Order, 'orderCanceled' | 'orderShipped'>
  ) => {
    if (order.orderCanceled) {
      return <Badge variant="destructive">Peruttu</Badge>;
    }
    if (order.orderShipped) {
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
          {!orderCode.orders && <Cart />}
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
              {orderCode && orderCode.orders ? (
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
                    <TableRow key={orderCode.orders.$id}>
                      <TableCell className="font-medium">
                        {orderCode.orders.$id}
                      </TableCell>
                      <TableCell>{getStatusBadge(orderCode.orders)}</TableCell>
                      <TableCell>
                        {orderCode.orders.orderItems
                          ?.map((p) => p.title)
                          .join(', ')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/tilaus/${orderCode.orders.$id}`}>
                            Tarkastele
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">
                  {orderCode
                    ? 'Tällä tilauskoodilla ei ole vielä tehty tilausta.'
                    : 'Kirjaudu sisään tai syötä tilauskoodi nähdäksesi tilauksen.'}
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
