'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OrderCode } from '@/interfaces/orderCode.interface';
import Link from 'next/link';
import { useState } from 'react';

const KooditTable = ({ orderCodes }: { orderCodes: OrderCode[] }) => {
  const [filters, setFilters] = useState({
    orderCode: '',
    creator: '',
    active: false,
    noActive: false,
    sortBy: 'orderCode',
    sortDirection: 'asc',
  });

  return (
    <Table className="w-full px-4 py-2 rounded shadow bg-white">
      <TableHeader>
        <TableRow>
          <TableHead>
            Koodi
            <input
              type="text"
              onChange={(e) =>
                setFilters({ ...filters, orderCode: e.target.value })
              }
            />
          </TableHead>
          <TableHead>
            Tekijä{' '}
            <input
              type="text"
              onChange={(e) =>
                setFilters({ ...filters, creator: e.target.value })
              }
            />
          </TableHead>
          <TableHead>Tilannut</TableHead>
          <TableHead>
            Aktiivinen{' '}
            <select
              onChange={(e) => {
                const value = e.target.value;
                setFilters({
                  ...filters,
                  active: value === 'yes',
                  noActive: value === 'no',
                });
              }}
            >
              <option value="all">Kaikki</option>
              <option value="yes">Kyllä</option>
              <option value="no">Ei</option>
            </select>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderCodes
          .filter((orderCode) => {
            if (
              filters.orderCode.length > 0 &&
              !orderCode.orderCode.includes(filters.orderCode)
            ) {
              return false;
            }
            if (filters.active && !orderCode.isActive) {
              return false;
            }
            return true;
          })
          .map((orderCode) => (
            <TableRow key={orderCode.$id}>
              <TableCell>
                <Link
                  href={`/hallinta/koodit/${orderCode.$id}`}
                  className="text-link hover:underline"
                >
                  {orderCode.code}
                </Link>
              </TableCell>
              <TableCell>{orderCode.creator}</TableCell>
              <TableCell>{orderCode.orders ? 'Kyllä' : 'Ei'}</TableCell>
              <TableCell>{orderCode.isActive ? 'Kyllä' : 'Ei'}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default KooditTable;
