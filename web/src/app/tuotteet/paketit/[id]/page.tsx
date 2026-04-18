import AddToCart from '@/components/AddToCart';
import { Heading, Paragraph } from '@/components/Text';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { BundleDatabase, BundleDocument } from '@/interfaces/bundle.interface';
import { CanAddToCart } from '@/interfaces/orderCode.interface';
import { clientSideBundle } from '@/lib/clientSideProduct';
import { getDocumentWithApi } from '@/services/databases';
import { canAddToCart } from '@/services/orderCode';

import Image from 'next/image';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

const BundlePage = async ({ params }: Props) => {
  const { id } = await params;

  const { data } = await getDocumentWithApi<BundleDocument>(
    BundleDatabase.DatabaseId,
    BundleDatabase.CollectionId,
    id
  );

  const canAdd = await canAddToCart();

  if (!data || data.hidden) notFound();

  // const stock = data.products
  //   .map((product) => product.stock)
  //   .sort((a, b) => a - b)[0];

  const promoImage = data.promoImage
    ? { picture: data.promoImage, title: data.title }
    : null;

  const images = data.products
    .map((product) =>
      product.pictures.map((picture) => ({
        picture,
        title: product.title,
      }))
    )
    .flat();

  return (
    <div className="relative mb-6">
      <div className="flex flex-col gap-4 w-full min-h-fit h-full">
        {data.products && (
          <Carousel className="w-full">
            <CarouselContent>
              {[promoImage, ...images]
                .filter((image) => image !== null)
                .map(({ picture, title }, index) => {
                  return (
                    <CarouselItem key={index}>
                      <Image
                        className="rounded-md aspect-square object-cover"
                        src={picture.src}
                        alt={picture.alt}
                        height={picture.height}
                        width={picture.width}
                      />
                      <Paragraph className="text-center text-sm font-light">
                        {title}
                      </Paragraph>
                    </CarouselItem>
                  );
                })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}

        <div className="grow px-4 bg-card text-card-foreground rounded-md pt-4 pb-2">
          <Heading.h3 className="font-light text-2xl">{data.title}</Heading.h3>
          <Paragraph className="font-light">{data.description}</Paragraph>
          {canAdd !== CanAddToCart.CodeNotFound && data.available && (
            <AddToCart bundle={data} canAddToCart={canAdd} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BundlePage;
