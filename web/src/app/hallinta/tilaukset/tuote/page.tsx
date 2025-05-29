import { Heading } from '@/components/Text';
import { Card, CardContent } from '@/components/ui/card';
import { OrderItem } from '@/interfaces/order.interface';
import { OrderItemDatabase } from '@/interfaces/orderItems.interface';
import { listDocumentsWithApi } from '@/services/databases';
import { redirect } from 'next/navigation';
import { Query } from 'node-appwrite';
import TuotteetTable from './TuoteTilauksetTable';
import { Product } from '@/interfaces/product.interface';
import { Bundle } from '@/interfaces/bundle.interface';
import { Suspense } from 'react';
import { getLoggedInUser } from '@/services/userSession';
import isAdmin, { isPostittaja } from '@/lib/isAdmin';

export interface OrdersPerItem {
  $id: string;
  item: Product | Bundle;
  type: 'product' | 'bundle';
  quantity: number;
}

const getData = async () => {
  const time1 = Date.now();
  const { data } = await listDocumentsWithApi<OrderItem>(
    OrderItemDatabase.DatabaseId,
    OrderItemDatabase.CollectionId,
    [Query.limit(1000)]
  );

  if (!data) redirect('/');

  const items = new Map<string, OrdersPerItem>();

  for (const item of data) {
    if (item.product) {
      if (items.has(item.product.$id + ':product')) {
        items.get(item.product.$id + ':product')!.quantity += item.quantity;
      } else {
        items.set(item.product.$id + ':product', {
          $id: item.product.$id,
          item: item.product,
          quantity: item.quantity,
          type: 'product',
        });
      }
    } else if (item.bundle) {
      if (items.has(item.bundle.$id + ':bundle')) {
        items.get(item.bundle.$id + ':bundle')!.quantity += item.quantity;
      } else {
        items.set(item.bundle.$id + ':bundle', {
          $id: item.bundle.$id,
          item: item.bundle,
          quantity: item.quantity,
          type: 'bundle',
        });
      }
    }
  }

  const time2 = Date.now();
  console.log('Time taken to process items:', time2 - time1, 'ms');
  return Array.from(items.values());
};

const TilauksetTuotePage = async () => {
  const { user } = await getLoggedInUser();

  if (!isAdmin(user) && !isPostittaja(user)) redirect('/');

  const data = getData();

  return (
    <div className="space-y-4">
      <Heading.h1>Tuotteet</Heading.h1>
      <Card>
        <CardContent>
          <Suspense fallback={<div>Ladataan...</div>}>
            <TuotteetTable data={data} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

export default TilauksetTuotePage;
