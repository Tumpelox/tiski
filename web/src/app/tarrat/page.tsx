import { Heading } from '@/components/Text';

import { Bundle } from '@/interfaces/bundle.interface';

import {
  Product,
  ProductDatabase,
  ProductDocument,
} from '@/interfaces/product.interface';
import { clientSideProduct } from '@/lib/clientSideProduct';
import { cn } from '@/lib/utils';
import { listDocumentsWithApi } from '@/services/databases';
import { Suspense } from 'react';
import TarraCard from './TarraCard';

const getProducts = async () => {
  const { data } = await listDocumentsWithApi<ProductDocument>(
    ProductDatabase.DatabaseId,
    ProductDatabase.CollectionId
  );

  if (!data) {
    return [];
  }

  return data
    .filter((product) => product.hidden === false)
    .map((product) => clientSideProduct(product));
};

const TarratPage = async () => {
  // const { user } = await getLoggedInUser();
  // const orderCode = await getOrderCode(user);
  const products = await getProducts();

  const items = [...products];

  return (
    <div className="flex flex-col gap-10 text-accent-foreground">
      <Heading.h1 className="text-center text-4xl md:text-5xl mt-4">
        TARRAT
      </Heading.h1>
      <div
        className={cn('grid grid-cols-1 gap-4 w-full', {
          'sm:grid-cols-1': items.length === 1,
          'sm:grid-cols-2': items.length === 2,
          'sm:grid-cols-2 md:grid-cols-3': items.length >= 3,
        })}
      >
        <Suspense fallback={<div>Ladataan tarroja...</div>}>
          {items.map((item: Product | Bundle) => {
            if (Object.hasOwn(item, 'pictures')) {
              return <TarraCard key={item.$id} item={item as Product} />;
            }
          })}
        </Suspense>
      </div>
    </div>
  );
};

export default TarratPage;
