'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Order } from '@/interfaces/order.interface';
import Link from 'next/link';
import { Suspense, useState } from 'react';

const TilauksetTable = ({ orders }: { orders: Order[] }) => {
  const [filters, setFilters] = useState({
    id: '',
    orderCode: '',
    shipped: false,
    canceled: false,
    waiting: false,
  });

  return (
    <Table className="w-full px-4 py-2 rounded shadow bg-white">
      <TableHeader>
        <TableRow>
          <TableHead>
            Tilausnumero{' '}
            <input
              type="text"
              onChange={(e) => setFilters({ ...filters, id: e.target.value })}
            />
          </TableHead>
          <TableHead>
            Käytetty koodi{' '}
            <input
              type="text"
              onChange={(e) => setFilters({ ...filters, id: e.target.value })}
            />
          </TableHead>
          <TableHead>
            Tila{' '}
            <select
              onChange={(e) => {
                const value = e.target.value;
                setFilters({
                  ...filters,
                  waiting: value === 'waiting',
                  shipped: value === 'shipped',
                  canceled: value === 'canceled',
                });
              }}
            >
              <option value="all">Kaikki</option>
              <option value="waiting">Odottamassa</option>
              <option value="shipped">Lähetetty</option>
              <option value="canceled">Peruutettu</option>
            </select>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Suspense fallback={<div>Ladataan tilauksia...</div>}>
          {orders
            .filter((order) => {
              if (filters.id.length > 0 && !order.$id.includes(filters.id)) {
                return false;
              }
              if (
                filters.orderCode.length > 0 &&
                !order.orderCode.includes(filters.orderCode)
              ) {
                return false;
              }
              if (filters.shipped && !order.orderShipped) {
                return false;
              }
              if (filters.canceled && !order.orderCanceled) {
                return false;
              }
              if (
                filters.waiting &&
                order.orderShipped &&
                order.orderCanceled
              ) {
                return false;
              }
              return true;
            })
            .map((order) => (
              <TableRow key={order.$id}>
                <TableCell>
                  <Link
                    href={`/hallinta/tilaukset/${order.$id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {order.$id}
                  </Link>
                </TableCell>
                <TableCell>{order?.orderCode?.code ?? 'Ei'}</TableCell>
                <TableCell>
                  {order.orderShipped
                    ? 'Lähetetty'
                    : order.orderCanceled
                      ? 'Peruutettu'
                      : 'Odottamassa'}
                </TableCell>
              </TableRow>
            ))}
        </Suspense>
      </TableBody>
    </Table>
  );
};

export default TilauksetTable;
