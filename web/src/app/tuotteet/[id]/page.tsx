import AddToCard from '@/components/AddToCard';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  exampleProduct,
  ProductDatabase,
  ProductDocument,
} from '@/interfaces/product.interface';
import { clientSideProduct } from '@/lib/clientSideProduct';
import { getDocumentWithApi } from '@/services/databases';
import Image from 'next/image';
import { notFound } from 'next/navigation';

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

  if (!data || !data.available) notFound();
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
          <div className="col-span-2">
            <CardHeader className="h-full justify-between">
              <div>
                <h2>{data.title}</h2>
                <p>{data.description}</p>
              </div>

              <AddToCard product={clientSideProduct(exampleProduct)} />
            </CardHeader>
          </div>
        </CardContent>
        <CardFooter>
          <div>
            <p>Tuotenumero: {id}</p>
            <p>Varastossa: {data.stock}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductPage;
