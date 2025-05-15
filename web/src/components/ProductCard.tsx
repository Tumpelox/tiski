'use client';

import { Product } from '@/interfaces/product.interface';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import Link from 'next/link';
import AddToCart from './AddToCart';
import { CanAddToCart } from '@/interfaces/orderCode.interface';
import { Heading, Paragraph } from './Text';
import { cn } from '@/lib/utils';

interface ProductProps extends React.ComponentProps<'div'> {
  product: Product;
  canAddToCart?: CanAddToCart;
}

const ProductCard = ({
  product,
  canAddToCart = CanAddToCart.CodeNotFound,
  className,
  ...props
}: ProductProps) => {
  const productPicture = product.pictures[0] ?? null;
  return (
    <Card className={cn(className)} {...props}>
      <Link href={`/tuotteet/${product.$id}`}>
        {productPicture && (
          <CardContent className="flex justify-center">
            <Image
              src={productPicture.src}
              alt={productPicture.alt}
              height={productPicture.height}
              width={productPicture.width}
              className="max-w-2xl w-full"
            />
          </CardContent>
        )}
        <CardHeader className="pt-4 w-full text-center space-y-2">
          <Heading.h3 className="font-light text-2xl">
            {product.title}
          </Heading.h3>
          <Paragraph className="font-light">{product.description}</Paragraph>
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
