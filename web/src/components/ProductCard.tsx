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
import AddToCart from './AddToCart';
import { CanAddToCart } from '@/interfaces/orderCode.interface';

const ProductCard = ({
  product,
  canAddToCart = CanAddToCart.CodeNotFound,
}: {
  product: Product;
  canAddToCart?: CanAddToCart;
}) => {
  const productPicture = product.pictures[0] ?? null;
  return (
    <Card className="md:max-w-56">
      <Link href={`/tuotteet/${product.$id}`}>
        {productPicture && (
          <CardContent>
            <Image
              className="rounded w-full"
              src={productPicture.src}
              alt={productPicture.alt}
              height={productPicture.height}
              width={productPicture.width}
            />
          </CardContent>
        )}
        <CardHeader className="pt-4 w-full text-center">
          <CardTitle>
            <h2>{product.title}</h2>
          </CardTitle>
          <CardDescription>
            <p>{product.description}</p>
          </CardDescription>
        </CardHeader>
      </Link>
      {canAddToCart !== CanAddToCart.CodeNotFound && product.available && (
        <CardFooter>
          <AddToCart product={product} canAddToCart={canAddToCart} />
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
