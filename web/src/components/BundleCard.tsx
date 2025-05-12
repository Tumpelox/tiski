'use client';

import { Product } from '@/interfaces/product.interface';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from './ui/card';
import Link from 'next/link';
import AddToCart from './AddToCart';
import { Bundle } from '@/interfaces/bundle.interface';
import { CanAddToCart } from '@/interfaces/orderCode.interface';
import Title from './Title';

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
                src={productPicture.src}
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
  return (
    <Card className="md:max-w-56">
      <Link href={`/tuotteet/paketit/${bundle.$id}`}>
        {bundle.promoImage ? (
          <CardContent className="">
            <Image
              src={bundle.promoImage.src}
              width={bundle.promoImage.width}
              height={bundle.promoImage.height}
              alt={bundle.promoImage.alt}
            />
          </CardContent>
        ) : (
          <CardContent className="grid grid-cols-2 gap-2">
            <BundleImages products={bundle.products} />
          </CardContent>
        )}

        <CardHeader className="pt-4 w-full text-center">
          <Title.h3>{bundle.title}</Title.h3>
          <CardDescription>
            <p>{bundle.description}</p>
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
