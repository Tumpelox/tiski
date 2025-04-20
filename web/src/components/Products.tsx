'use client';

import { Product } from '@/interfaces/product.interface';
import { use } from 'react';
import ProductCard from './ProductCard';

const Products = ({
  productsPromise,
}: {
  productsPromise: Promise<Product[]>;
}) => {
  const products = use(productsPromise);

  return (
    <div className="grid grid-cols-3 gap-4 mx-auto w-fit">
      {products.map((product) => (
        <ProductCard key={product.$id} product={product} />
      ))}
    </div>
  );
};

export default Products;
