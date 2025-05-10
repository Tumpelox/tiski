import BundleCard from '@/components/BundleCard';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
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
import { listDocumentsWithApi } from '@/services/databases';
import { canAddToCart } from '@/services/orderCode';
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
  const products = await getProducts();
  const bundles = await getBundles();

  const canAdd = await canAddToCart();

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-4">
        <CardTitle>Listaus tuotteista</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-fit">
          <Suspense fallback={<div>Ladataan tuotteita...</div>}>
            {[...products, ...bundles]
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((item: Product | Bundle, index) => {
                if (Object.hasOwn(item, 'products')) {
                  return (
                    <BundleCard
                      key={index}
                      bundle={item as Bundle}
                      canAddToCart={canAdd}
                    />
                  );
                }
                if (Object.hasOwn(item, 'pictures')) {
                  return (
                    <ProductCard
                      key={index}
                      product={item as Product}
                      canAddToCart={canAdd}
                    />
                  );
                }
              })}
          </Suspense>
        </div>
      </CardContent>
    </Card>
  );
};

export default TuotteetPage;
