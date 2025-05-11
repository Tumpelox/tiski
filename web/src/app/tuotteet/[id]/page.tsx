import AddToCart from '@/components/AddToCart';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
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

  if (!data || !data.hidden) notFound();

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
                      <CarouselItem key={picture.url}>
                        <Image
                          className="rounded w-full"
                          src={picture.url}
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
            <AddToCart
              product={clientSideProduct(data)}
              canAddToCart={canAdd}
            />
            <div className="w-full h-full justify-between">
              <CardTitle>{data.title}</CardTitle>
              <CardDescription>{data.description}</CardDescription>
            </div>
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
