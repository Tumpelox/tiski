'use client';

import { Product } from '@/interfaces/product.interface';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import Link from 'next/link';
import AddToCard from './AddToCard';

const ProductCard = ({ product }: { product: Product }) => {
  const productPicture = product.pictures[0] ?? null;
  return (
    <Card className="w-56">
      <Link href={`/tuotteet/${product.$id}`}>
        {productPicture && (
          <CardContent>
            <Image
              className="rounded w-full"
              src={productPicture.url}
              alt={productPicture.alt}
              height={productPicture.height}
              width={productPicture.width}
            />
          </CardContent>
        )}

        <CardHeader className="pt-4">
          <CardTitle>
            <h2>{product.title}</h2>
          </CardTitle>
          <CardDescription>
            <p>{product.description}</p>
            <p>Varastossa: {product.stock}</p>
          </CardDescription>
        </CardHeader>
      </Link>
      <CardFooter>
        <AddToCard product={product} />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
