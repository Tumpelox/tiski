'use client';

import { Product } from '@/interfaces/product.interface';
import Image from 'next/image';
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
    <div className={cn(className)} {...props}>
      <div className="relative mb-6">
        <div className="flex flex-col gap-4 w-full min-h-fit h-full">
          {bundle.promoImage && (
            <Image
              src={bundle.promoImage.src}
              width={bundle.promoImage.width}
              height={bundle.promoImage.height}
              alt={bundle.promoImage.alt}
              className="rounded-md aspect-square object-cover"
            />
          )}
          <div className="grow px-4 bg-card text-card-foreground rounded-md pt-4 pb-2">
            <Heading.h3 className="font-light text-2xl">
              {bundle.title}
            </Heading.h3>
            <Paragraph className="font-light">{bundle.description}</Paragraph>
            {canAddToCart !== CanAddToCart.CodeNotFound && bundle.available && (
              <AddToCart bundle={bundle} canAddToCart={canAddToCart} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleCard;
