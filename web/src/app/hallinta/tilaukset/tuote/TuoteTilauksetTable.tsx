'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Bundle } from '@/interfaces/bundle.interface';
import { Product } from '@/interfaces/product.interface';
import Image from 'next/image';
import Link from 'next/link';
import { OrdersPerItem } from './page';
import { use } from 'react';

const TuoteTilauksetTable = ({ data }: { data: Promise<OrdersPerItem[]> }) => {
  const items = use(data);
  // const [filters, setFilters] = useState({
  //   orderCode: '',
  //   creator: '',
  //   active: false,
  //   noActive: false,
  //   sortBy: 'orderCode',
  //   sortDirection: 'asc',
  // });

  return (
    <Table className="w-full px-4 py-2 rounded shadow bg-white">
      <TableHeader>
        <TableRow>
          <TableHead>Tuotekuva</TableHead>
          <TableHead>Tuote</TableHead>
          <TableHead>Tilattu</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          return (
            <TableRow key={item.$id}>
              <TableCell>
                <Link
                  href={`/tuotteet${item.type === 'bundle' ? '/paketit/' + item.$id : item.$id}`}
                  className="text-link hover:underline"
                >
                  {item.type === 'product' &&
                    (item.item as Product).pictures[0] && (
                      <div className="size-full  sm:size-24 aspect-square relative col-span-2">
                        <Image
                          src={(item.item as Product).pictures[0].src}
                          alt={(item.item as Product).pictures[0].alt}
                          fill
                          className="object-cover rounded "
                        />
                      </div>
                    )}
                  {item.type === 'bundle' &&
                    (item.item as Bundle).promoImage && (
                      <div className="size-full sm:size-24 aspect-square relative col-span-2">
                        <Image
                          src={(item.item as Bundle).promoImage?.src as string}
                          alt={(item.item as Bundle).promoImage?.alt as string}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={`/tuotteet${item.type === 'bundle' ? '/paketit/' + item.$id : item.$id}`}
                  className="text-link hover:underline"
                >
                  {item.item.title}
                </Link>
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TuoteTilauksetTable;
