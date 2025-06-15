'use client';

import { updateOrder } from '@/actions/order';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Order } from '@/interfaces/order.interface';
import { updateOrderSchema } from '@/schemas/order.schema';
import { useToastMessageStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { produce } from 'immer';
import Link from 'next/link';
import { redirect, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { create } from 'zustand';

interface OrderStore {
  orderStore: Order[];
  initStore: (orders: Order[]) => void;
  updateStore: (order: Order) => void;
  removeFromStore: ($id: string) => void;
}

export const useStore = create<OrderStore>((set) => ({
  orderStore: [],
  initStore: (orderCodes) =>
    set(
      produce((state: OrderStore) => {
        state.orderStore = orderCodes;
      })
    ),
  updateStore: (orderCode) =>
    set(
      produce((state: OrderStore) => {
        const index = state.orderStore.findIndex(
          (code) => code.$id === orderCode.$id
        );
        if (index !== -1) {
          state.orderStore[index] = orderCode;
        }
      })
    ),
  removeFromStore: ($id) =>
    set(
      produce((state: OrderStore) => {
        state.orderStore = state.orderStore.filter((code) => code.$id !== $id);
      })
    ),
}));

const TilausRow = ({ order }: { order: Order }) => {
  const convertOrderToStatus = () => {
    return order.orderShipped
      ? 'shipped'
      : order.orderCanceled
        ? 'canceled'
        : 'waiting';
  };

  const [statusState, setStatusState] = useState(convertOrderToStatus);
  const { addMessage } = useToastMessageStore();
  const { updateStore } = useStore();

  const convertStatusToCorrectFormat = (status: string) => {
    switch (status) {
      case 'waiting':
        return { orderShipped: null, orderCanceled: null };
      case 'shipped':
        return { orderShipped: new Date(), orderCanceled: null };
      case 'canceled':
        return { orderShipped: null, orderCanceled: new Date() };
      default:
        return { orderShipped: null, orderCanceled: null };
    }
  };

  const form = useForm<z.infer<typeof updateOrderSchema>>({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: {
      $id: order.$id,
      orderShipped: order.orderShipped,
      orderCanceled: order.orderCanceled,
    },
  });

  const onSubmit = async (values: z.infer<typeof updateOrderSchema>) => {
    const result = await updateOrder({
      ...values,
      $id: order.$id,
    });

    if (result) {
      addMessage(result.message, result.type);
      if (result.data) {
        updateStore(result.data);
      }
    }
  };

  return (
    <TableRow key={order.$id}>
      <TableCell>
        <Link
          href={`/hallinta/tilaukset/${order.$id}`}
          className="text-blue-500 hover:underline"
        >
          {order.$id}
        </Link>
      </TableCell>
      <TableCell>
        <Select
          value={statusState}
          onValueChange={(value: string) => {
            const newStatus = convertStatusToCorrectFormat(value);
            form.setValue('orderShipped', newStatus.orderShipped);
            form.setValue('orderCanceled', newStatus.orderCanceled);
            setStatusState(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Valitse tilauksen tila" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="waiting">Odottamassa</SelectItem>
            <SelectItem value="shipped">Lähetetty</SelectItem>
            <SelectItem value="canceled">Peruutettu</SelectItem>
          </SelectContent>
        </Select>
        {statusState !== convertOrderToStatus() && (
          <Button
            variant="secondary"
            size={'sm'}
            className="ml-2"
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            {form.formState.isSubmitting ? 'Odota...' : 'Tallenna'}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

const TilauksetTable = ({
  orders,
  total,
}: {
  orders: Order[];
  total: number;
}) => {
  const currentSearchParams = useSearchParams();

  const [filters, setFilters] = useState({
    id: currentSearchParams.get('contains') ?? '',
  });

  const searchParams = useMemo(
    () => new URLSearchParams(currentSearchParams),
    [currentSearchParams]
  );

  const modifiedSearchParams = (key: string, value: string) => {
    if (value === '') {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }

    return `/hallinta/tilaukset?${searchParams.toString()}`;
  };

  const size = useMemo(
    () => parseInt(searchParams.get('size') ?? '25'),
    [searchParams]
  );
  const page = useMemo(
    () => parseInt(searchParams.get('page') ?? '1'),
    [searchParams]
  );

  const paginationFrom =
    useMemo(() => {
      if (page - 1 >= 0) {
        if (page > 1) {
          return page - 1;
        } else return 1;
      }
    }, [page]) ?? 1;

  // const paginationTo = useMemo(() => {
  //   if (page - 2 >= 0) {
  //     if (page > 2) {
  //       if (page + 2 <= Math.ceil(total / size)) {
  //         return page + 1;
  //       } else return Math.ceil(total / size);
  //     } else {
  //       if (page + 2 <= Math.ceil(total / size)) {
  //         return page + 2;
  //       } else return Math.ceil(total / size);
  //     }
  //   }
  // }, [page, total, size]) ?? 1

  const handeSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (filters.id.length > 0) {
      searchParams.set('contains', filters.id);
      searchParams.set('page', '1');
    } else {
      searchParams.delete('contains');
      searchParams.set('page', '1');
    }

    redirect(`/hallinta/tilaukset?${searchParams.toString()}`);
  };

  return (
    <>
      <form className="flex gap-4" onSubmit={handeSearch}>
        <Input
          type="text"
          placeholder="Hae tilausnumeroa..."
          value={filters.id}
          onChange={(e) => setFilters({ ...filters, id: e.target.value })}
          className="w-64"
        />
        <Button type="submit">Hae</Button>
      </form>

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
              Tila{' '}
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'all') searchParams.delete('status');
                  else {
                    searchParams.set('status', value);
                    searchParams.set('page', '1');
                  }
                  redirect(`/hallinta/tilaukset?${searchParams.toString()}`);
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

                return true;
              })
              .map((order) => (
                <TilausRow key={order.$id} order={order} />
              ))}
          </Suspense>
        </TableBody>
      </Table>
      <div className="flex items-center justify-between flex-col md:flex-row gap-4 mt-4">
        <Select
          defaultValue={size.toString()}
          onValueChange={(value) => {
            searchParams.set('size', String(value));
            searchParams.set('page', '1');
            console.log(searchParams.toString());
            redirect(`/hallinta/tilaukset?${searchParams.toString()}`);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Kpl" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">25 kpl</SelectItem>
            <SelectItem value="50">50 kpl</SelectItem>
            <SelectItem value="100">100 kpl</SelectItem>
          </SelectContent>
        </Select>
        <Pagination>
          <PaginationContent>
            {page !== 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={modifiedSearchParams('page', String(page - 1))}
                >
                  Edellinen
                </PaginationPrevious>
              </PaginationItem>
            )}
            {paginationFrom > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href={modifiedSearchParams('page', String(1))}
                    isActive={page === 1}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              </>
            )}
            {total > size &&
              Array.from({
                length: Math.min(
                  3,
                  Math.ceil(total / size) - paginationFrom + 1
                ),
              }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href={modifiedSearchParams(
                      'page',
                      String(index + paginationFrom)
                    )}
                    isActive={page === index + paginationFrom}
                  >
                    {index + paginationFrom}
                  </PaginationLink>
                </PaginationItem>
              ))}
            {Math.max(3, Math.ceil(total / size) - paginationFrom + 1) !==
              3 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href={modifiedSearchParams(
                      'page',
                      String(Math.ceil(total / size))
                    )}
                    isActive={page === Math.ceil(total / size)}
                  >
                    {Math.ceil(total / size)}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            {page !== Math.ceil(total / size) && (
              <PaginationItem>
                <PaginationNext
                  href={modifiedSearchParams('page', String(page + 1))}
                >
                  Seuraava
                </PaginationNext>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
        <div></div>
      </div>
    </>
  );
};

export default TilauksetTable;
