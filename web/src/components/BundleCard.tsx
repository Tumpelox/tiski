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
import { Bundle } from '@/interfaces/bundle.interface';
import { CanAddToCart } from '@/interfaces/orderCode.interface';

export const BundleImages = ({ products }: { products: Product[] | null }) => {
  return (
    <>
      {products &&
        products.map((product) => {
          const productPicture = product.pictures[0];
          return (
            <div className="w-full h-full" key={product.$id}>
              <Image
                className="rounded h-full"
                src={productPicture.url}
                alt={productPicture.alt}
                height={productPicture.height}
                width={productPicture.width}
              />
            </div>
          );
        })}
    </>
  );
};

const BundleCard = ({
  bundle,
  canAddToCart = CanAddToCart.CodeNotFound,
}: {
  bundle: Bundle;
  canAddToCart?: CanAddToCart;
}) => {
  const stock = bundle.products
    .map((product) => product.stock)
    .sort((a, b) => a - b)[0];

  return (
    <Card className="md:max-w-56">
      <Link href={`/tuotteet/paketit/${bundle.$id}`}>
        <CardContent className="grid grid-cols-2 gap-2">
          <BundleImages products={bundle.products} />
        </CardContent>
        <CardHeader className="pt-4">
          <CardTitle>
            <h2>{bundle.title}</h2>
          </CardTitle>
          <CardDescription>
            <p>{bundle.description}</p>
            <p>Varastossa: {stock}</p>
          </CardDescription>
        </CardHeader>
      </Link>
      {canAddToCart !== CanAddToCart.CodeNotFound && bundle.available && (
        <CardFooter>
          <AddToCart bundle={bundle} canAddToCart={canAddToCart} />
        </CardFooter>
      )}
    </Card>
  );
};

export default BundleCard;
