import AddToCart from '@/components/AddToCart';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
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
import Title from '@/components/Title';

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
    <div className="px-4 md:px-8 ">
      <Card className="max-w-5xl mx-auto">
        <CardContent className="flex flex-col md:grid md:grid-cols-5 gap-16">
          {data.pictures && (
            <div className="col-span-3 px-10">
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

          <div className="col-span-2 flex flex-col gap-4 items-end md:flex-col-reverse">
            <div className="flex flex-col gap-4 w-full">
              <Title.h1 className="text-2xl text-center">{data.title}</Title.h1>
              <CardDescription className="text-center">
                {data.description}
              </CardDescription>
            </div>
            <AddToCart
              product={clientSideProduct(data)}
              canAddToCart={canAdd}
            />
          </div>
        </CardContent>
        <CardContent>
          <p>Tuotenumero: {id}</p>
          <p>Varastossa: {data.stock}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductPage;
