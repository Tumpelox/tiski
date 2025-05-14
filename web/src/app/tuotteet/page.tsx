import BundleCard from '@/components/BundleCard';
import LoginWithCode from '@/components/LoginWithCode';
import ProductCard from '@/components/ProductCard';
import { Heading } from '@/components/Text';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bundle,
  BundleDatabase,
  BundleDocument,
} from '@/interfaces/bundle.interface';
import {
  Product,
  ProductDatabase,
  ProductDocument,
} from '@/interfaces/product.interface';
import { clientSideBundle, clientSideProduct } from '@/lib/clientSideProduct';
import { cn } from '@/lib/utils';
import { listDocumentsWithApi } from '@/services/databases';
import { canAddToCart, getOrderCode } from '@/services/orderCode';
import { getLoggedInUser } from '@/services/userSession';
import { Suspense } from 'react';

const getBundles = async () => {
  const { data } = await listDocumentsWithApi<BundleDocument>(
    BundleDatabase.DatabaseId,
    BundleDatabase.CollectionId
  );

  if (!data) {
    return [];
  }

  return data.map((bundle) => clientSideBundle(bundle));
};

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

const TuotteetPage = async () => {
  const user = await getLoggedInUser();
  const orderCode = await getOrderCode(user);
  const products = await getProducts();
  const bundles = await getBundles();

  const canAdd = await canAddToCart();

  const items = [...products, ...bundles].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  return (
    <div className="flex flex-col gap-10 text-accent-foreground">
      <Heading.h1 className="text-center text-4xl md:text-5xl mt-4">
        TARRAT
      </Heading.h1>
      {!orderCode && (
        <Card className="w-full">
          <CardContent>
            <LoginWithCode />
          </CardContent>
        </Card>
      )}
      <div
        className={cn('grid grid-cols-1 gap-4 w-full', {
          'sm:grid-cols-1': items.length === 1,
          'sm:grid-cols-2': items.length === 2,
          'sm:grid-cols-2 md:grid-cols-3': items.length >= 3,
        })}
      >
        <Suspense fallback={<div>Ladataan tuotteita...</div>}>
          {items.map((item: Product | Bundle, index) => {
            if (Object.hasOwn(item, 'products')) {
              return (
                <BundleCard
                  key={index}
                  bundle={item as Bundle}
                  canAddToCart={canAdd}
                  className={cn({ 'w-full': items.length === 1 })}
                />
              );
            }
            if (Object.hasOwn(item, 'pictures')) {
              return (
                <ProductCard
                  key={index}
                  product={item as Product}
                  canAddToCart={canAdd}
                  className={cn({ 'w-full': items.length === 1 })}
                />
              );
            }
          })}
        </Suspense>
      </div>
    </div>
  );
};

export default TuotteetPage;
