import AddToCart from '@/components/AddToCart';
import Title from '@/components/Title';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
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

  const stock = data.products
    .map((product) => product.stock)
    .sort((a, b) => a - b)[0];

  const canAdd = await canAddToCart();

  return (
    <div className="px-4 md:px-8 ">
      <Card className="max-w-5xl mx-auto">
        <CardContent className="flex flex-col md:grid md:grid-cols-5 gap-16">
          {data.products && (
            <div className="col-span-3 px-10">
              <Carousel className="w-full">
                <CarouselContent>
                  {data.products
                    .map((product) =>
                      product.pictures.map((picture) => ({
                        picture,
                        title: product.title,
                      }))
                    )
                    .flat()
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
                          <CardDescription className="text-center">
                            {title}
                          </CardDescription>
                        </CarouselItem>
                      );
                    })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
          <div className="col-span-2 flex flex-col gap-4 items-end">
            <div className="flex flex-col gap-4 w-full">
              <Title.h1 className="text-2xl text-center">{data.title}</Title.h1>
              <CardDescription className="text-center">
                {data.description}
              </CardDescription>
            </div>
            <AddToCart bundle={clientSideBundle(data)} canAddToCart={canAdd} />
          </div>
        </CardContent>
        <CardContent>
          <p>Tuotenumero: {id}</p>
          <p>Varastossa: {stock}</p>
          <div>
            <p>Paketin tuotteet:</p>
            {data.products.map((product) => (
              <p key={product.$id}>{product.title}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BundlePage;
