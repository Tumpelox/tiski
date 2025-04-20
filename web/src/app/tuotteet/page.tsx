import ProductCard from '@/components/ProductCard';
import {
  ProductDatabase,
  ProductDocument,
} from '@/interfaces/product.interface';
import { clientSideProduct } from '@/lib/clientSideProduct';
import { listDocumentsWithApi } from '@/services/databases';
import { Suspense } from 'react';

const getProducts = async () => {
  const products = await listDocumentsWithApi<ProductDocument>(
    ProductDatabase.DatabaseId,
    ProductDatabase.CollectionId
  );

  return (products.data ?? []).map((product) => {
    return clientSideProduct(product);
  });
};

const TuotteetPage = async () => {
  const products = await getProducts();

  return (
    <div className="w-full">
      <h1>Listaus tuotteista</h1>
      <div className="grid grid-cols-3 gap-4 mx-auto w-fit">
        <Suspense fallback={<div>Ladataan tuotteita...</div>}>
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </Suspense>
      </div>
    </div>
  );
};

export default TuotteetPage;
