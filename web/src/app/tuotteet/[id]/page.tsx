import AddToCart from '@/components/AddToCart';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  ProductDatabase,
  ProductDocument,
} from '@/interfaces/product.interface';
import { clientSideProduct } from '@/lib/clientSideProduct';
import { getDocumentWithApi } from '@/services/databases';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { canAddToCart } from '@/services/orderCode';
import { Heading, Paragraph } from '@/components/Text';

interface Props {
  params: Promise<{ id: string }>;
}

const ProductPage = async ({ params }: Props) => {
  const { id } = await params;

  const { data } = await getDocumentWithApi<ProductDocument>(
    ProductDatabase.DatabaseId,
    ProductDatabase.CollectionId,
    id
  );

  if (!data || data.hidden) notFound();

  const canAdd = await canAddToCart();
  return (
    <Card className="max-w-5xl mx-auto w-full">
      <CardContent className="flex flex-col md:grid md:grid-cols-5 gap-6 md:gap-8">
        {data.pictures && (
          <div className="col-span-3">
            <Carousel className="w-full">
              <CarouselContent>
                {data.pictures.map((picture) => {
                  return (
                    <CarouselItem key={picture.src}>
                      <Image
                        className="rounded w-full"
                        src={picture.src}
                        alt={picture.alt}
                        height={picture.height}
                        width={picture.width}
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        <div className="col-span-2 flex flex-col gap-4 items-end justify-between md:pr-2">
          <div className="flex flex-col gap-4 md:gap-8 w-full">
            <Heading.h1 className="text-2xl md:text-3xl text-center font-light">
              {data.title}
            </Heading.h1>
            <Paragraph className="text-center font-light">
              {data.description}
            </Paragraph>
          </div>

          <AddToCart product={clientSideProduct(data)} canAddToCart={canAdd} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPage;
