import BundleCard from '@/components/BundleCard';
import ProductCard from '@/components/ProductCard';
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
    .filter((product) => product.available)
    .map((product) => clientSideProduct(product));
};

const TuotteetPage = async () => {
  const products = await getProducts();
  const bundles = await getBundles();

  return (
    <div className="w-full">
      <h1>Listaus tuotteista</h1>
      <div className="grid grid-cols-3 gap-4 mx-auto w-fit">
        <Suspense fallback={<div>Ladataan tuotteita...</div>}>
          {[...products, ...bundles]
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((item: Product | Bundle, index) => {
              if (Object.hasOwn(item, 'products')) {
                return <BundleCard key={index} bundle={item as Bundle} />;
              }
              if (Object.hasOwn(item, 'pictures')) {
                return <ProductCard key={index} product={item as Product} />;
              }
            })}
        </Suspense>
      </div>
    </div>
  );
};

export default TuotteetPage;
