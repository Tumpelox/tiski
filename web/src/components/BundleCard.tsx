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
import { Bundle } from '@/interfaces/bundle.interface';

const BundleCard = ({ bundle }: { bundle: Bundle }) => {
  const stock = bundle.products
    .map((product) => product.stock)
    .sort((a, b) => a - b)[0];

  return (
    <Card className="w-56">
      <Link href={`/tuotteet/paketit/${bundle.$id}`}>
        <CardContent className="grid grid-cols-2 gap-2">
          {bundle.products &&
            bundle.products.map((product) => {
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
      <CardFooter>
        <AddToCard bundle={bundle} />
      </CardFooter>
    </Card>
  );
};

export default BundleCard;
