'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Product } from '@/interfaces/product.interface';
import Image from 'next/image';
import Link from 'next/link';

const TuotteetTable = ({ products }: { products: Product[] }) => {
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
          <TableHead>Varastosaldo</TableHead>
          <TableHead>Piilotettu</TableHead>
          <TableHead>Tilattavissa</TableHead>
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
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TuotteetTable;
