'use client';

import { Product } from '@/interfaces/product.interface';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import Link from 'next/link';
import AddToCart from './AddToCart';
import { Bundle } from '@/interfaces/bundle.interface';
import { CanAddToCart } from '@/interfaces/orderCode.interface';
import { Heading, Paragraph } from './Text';
import { cn } from '@/lib/utils';

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

interface BundleCardProps extends React.ComponentProps<'div'> {
  bundle: Bundle;
  canAddToCart?: CanAddToCart;
}

const BundleCard = ({
  bundle,
  canAddToCart = CanAddToCart.CodeNotFound,
  className,
  ...props
}: BundleCardProps) => {
  return (
    <Card className={cn(className)} {...props}>
      <Link href={`/tuotteet/paketit/${bundle.$id}`}>
        {bundle.promoImage ? (
          <CardContent className="flex justify-center">
            <Image
              src={bundle.promoImage.src}
              width={bundle.promoImage.width}
              height={bundle.promoImage.height}
              alt={bundle.promoImage.alt}
              className="max-w-2xl"
            />
          </CardContent>
        ) : (
          <CardContent className="grid grid-cols-2 gap-2">
            <BundleImages products={bundle.products} />
          </CardContent>
        )}

        <CardHeader className="pt-4 w-full text-center space-y-2">
          <Heading.h3 className="font-light text-2xl">
            {bundle.title}
          </Heading.h3>
          <Paragraph className="font-light">{bundle.description}</Paragraph>
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
