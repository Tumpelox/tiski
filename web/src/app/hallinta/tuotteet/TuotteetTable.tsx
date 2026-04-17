'use client';

import { removeProduct } from '@/actions/product';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Product } from '@/interfaces/product.interface';
import { useToastMessageStore } from '@/store';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const TuotteetTable = ({ products }: { products: Product[] }) => {
  // const [filters, setFilters] = useState({
  //   orderCode: '',
  //   creator: '',
  //   active: false,
  //   noActive: false,
  //   sortBy: 'orderCode',
  //   sortDirection: 'asc',
  // });

  const addMessage = useToastMessageStore((state) => state.addMessage);
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const handleRemove = async (id: string) => {
    setLoading(true);

    const { message, type } = await removeProduct(id);

    addMessage(message, type);

    setLoading(false);

    router.refresh();
  };
  return (
    <Table className="w-full px-4 py-2 rounded shadow bg-white text-black">
      <TableHeader>
        <TableRow>
          <TableHead>Tuotekuva</TableHead>
          <TableHead>Tuote</TableHead>
          <TableHead>Varastosaldo</TableHead>
          <TableHead>Piilotettu</TableHead>
          <TableHead>Tilattavissa</TableHead>
          <TableHead>Toiminnot</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const picture = product.pictures[0] ?? null;

          return (
            <TableRow key={product.$id}>
              <TableCell>
                <Link
                  href={`/hallinta/tuotteet/${product.$id}`}
                  className="text-link hover:underline"
                >
                  {picture && (
                    <Image
                      src={picture.src}
                      width={picture.width}
                      height={picture.height}
                      alt={picture.alt}
                    />
                  )}
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={`/hallinta/tuotteet/${product.$id}`}
                  className="text-link hover:underline"
                >
                  {product.title}
                </Link>
              </TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.hidden ? 'Kyllä' : 'Ei'}</TableCell>
              <TableCell>{product.available ? 'Kyllä' : 'Ei'}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={'destructive'}
                      size={'sm'}
                      disabled={isLoading}
                    >
                      <Trash />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Haluatko varmasti poistaa tuotteen {product.title}?
                      </DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant={'outline'}>Peruuta</Button>
                      </DialogClose>{' '}
                      <Button
                        variant={'destructive'}
                        onClick={() => handleRemove(product.$id)}
                        disabled={isLoading}
                      >
                        Poista
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TuotteetTable;
