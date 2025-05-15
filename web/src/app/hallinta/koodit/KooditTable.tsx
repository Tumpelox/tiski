'use client';

import { deleteOrderCode, updateOrderCode } from '@/actions/orderCode';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { OrderCode } from '@/interfaces/orderCode.interface';
import { cn } from '@/lib/utils';
import { updateCodeSchema } from '@/schemas/orderCode.schema';
import { ToastType, useToastMessageStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { produce } from 'immer';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { create } from 'zustand';

interface OrderCodeStore {
  orderCodeStore: OrderCode[];
  initStore: (orderCodes: OrderCode[]) => void;
  updateStore: (orderCode: OrderCode) => void;
  removeFromStore: ($id: string) => void;
}

export const useStore = create<OrderCodeStore>((set) => ({
  orderCodeStore: [],
  initStore: (orderCodes) =>
    set(
      produce((state: OrderCodeStore) => {
        state.orderCodeStore = orderCodes;
      })
    ),
  updateStore: (orderCode) =>
    set(
      produce((state: OrderCodeStore) => {
        const index = state.orderCodeStore.findIndex(
          (code) => code.$id === orderCode.$id
        );
        if (index !== -1) {
          state.orderCodeStore[index] = orderCode;
        }
      })
    ),
  removeFromStore: ($id) =>
    set(
      produce((state: OrderCodeStore) => {
        state.orderCodeStore = state.orderCodeStore.filter(
          (code) => code.$id !== $id
        );
      })
    ),
}));

const KoodiRow = ({ orderCode }: { orderCode: OrderCode }) => {
  const { addMessage } = useToastMessageStore();
  const { updateStore, removeFromStore } = useStore();

  const form = useForm<z.infer<typeof updateCodeSchema>>({
    resolver: zodResolver(updateCodeSchema),
    defaultValues: {
      $id: orderCode.$id,
      isActive: orderCode.isActive,
    },
  });

  const onSubmit = async (values: z.infer<typeof updateCodeSchema>) => {
    const result = await updateOrderCode({
      ...values,
      $id: orderCode.$id,
    });

    if (result) {
      addMessage(result.message, result.type);
      if (result.data) {
        updateStore(result.data);
      }
    }
  };

  const handleDelete = async () => {
    addMessage(`Poistetaan koodi ${orderCode.code}`, ToastType.SUCCESS);
    const result = await deleteOrderCode(orderCode.$id);
    if (result) {
      addMessage(result.message.replace('{code}', orderCode.code), result.type);
      if (result.type === ToastType.SUCCESS) {
        removeFromStore(orderCode.$id);
      }
    }
  };

  return (
    <AlertDialog>
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
        <TableCell className="flex gap-2">
          <Select
            value={form.watch('isActive') ? 'true' : 'false'}
            onValueChange={(value: string) => {
              form.setValue('isActive', value === 'true' ? true : false);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Valitse koodin tila" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="true">Kyllä</SelectItem>
              <SelectItem value="false">Ei</SelectItem>
            </SelectContent>
          </Select>
          {form.watch('isActive') !== orderCode.isActive && (
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
        <TableCell>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Poista</Button>
          </AlertDialogTrigger>
        </TableCell>
      </TableRow>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Oletko varma että haluat poistaa koodin {orderCode.code}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Poiston jälkeen tietoja ei ole palautettavissa. Myös koodilla tehty
            tilaus poistetaan.
          </AlertDialogDescription>
          <AlertDialogFooter>
            {'Koodin ID ' + orderCode.$id + ''}
          </AlertDialogFooter>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row sm:items-center">
          <AlertDialogAction
            className={cn(
              buttonVariants({ variant: 'destructive', size: 'sm' }),
              'opacity-50'
            )}
            onClick={() => handleDelete()}
          >
            Poista
          </AlertDialogAction>
          <AlertDialogCancel className={cn(buttonVariants(), 'sm:grow')}>
            Peruuta
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const KooditTable = ({ orderCodes }: { orderCodes: OrderCode[] }) => {
  const { orderCodeStore, initStore } = useStore();

  useEffect(() => {
    initStore(orderCodes);
  }, [orderCodes, initStore]);

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
        {orderCodeStore
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
            <KoodiRow key={orderCode.$id} orderCode={orderCode} />
          ))}
      </TableBody>
    </Table>
  );
};

export default KooditTable;
