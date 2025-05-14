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

  if (!data || data.hidden) notFound();

  // const stock = data.products
  //   .map((product) => product.stock)
  //   .sort((a, b) => a - b)[0];

  const canAdd = await canAddToCart();

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
    <div className="px-4 md:px-8 ">
      <Card className="max-w-5xl mx-auto">
        <CardContent className="flex flex-col md:grid md:grid-cols-5 gap-6 md:gap-8">
          {data.products && (
            <div className="col-span-3">
              <Carousel className="w-full">
                <CarouselContent>
                  {[promoImage, ...images]
                    .filter((image) => image !== null)
                    .map(({ picture, title }, index) => {
                      return (
                        <CarouselItem key={index}>
                          <Image
                            className="rounded w-full"
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
            </div>
          )}
          <div className="col-span-2 flex flex-col gap-4 items-end justify-between">
            <div className="flex flex-col gap-4 md:gap-8 w-full">
              <Heading.h1 className="text-2xl md:text-3xl text-center font-light">
                {data.title}
              </Heading.h1>
              <Paragraph className="text-center font-light">
                {data.description}
              </Paragraph>
            </div>
            <AddToCart bundle={clientSideBundle(data)} canAddToCart={canAdd} />
          </div>
        </CardContent>
        {/* <CardContent>
          <Paragraph>Tuotenumero: {id}</Paragraph>
          <Paragraph>Varastossa: {stock}</Paragraph>
          <div>
            <p>Paketin tuotteet:</p>
            {data.products.map((product) => (
              <p key={product.$id}>{product.title}</p>
            ))}
          </div>
        </CardContent> */}
      </Card>
    </div>
  );
};

export default BundlePage;
