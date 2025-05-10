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
import { BundleDatabase, BundleDocument } from '@/interfaces/bundle.interface';
import { clientSideBundle } from '@/lib/clientSideProduct';
import { getDocumentWithApi } from '@/services/databases';
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

  if (!data || !data.available) notFound();

  const stock = data.products
    .map((product) => product.stock)
    .sort((a, b) => a - b)[0];
  return (
    <div className="px-4 md:px-8 ">
      <Card className="max-w-5xl mx-auto">
        <CardContent className="flex flex-col md:grid md:grid-cols-5 gap-16">
          {data.products && (
            <div className="col-span-3 px-10">
              <Carousel className="w-full">
                <CarouselContent>
                  {data.products
                    .map((product) => product.pictures)
                    .flat()
                    .map((picture, index) => {
                      return (
                        <CarouselItem key={index}>
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

              <AddToCard bundle={clientSideBundle(data)} />
            </CardHeader>
          </div>
        </CardContent>
        <CardFooter>
          <div>
            <p>Tuotenumero: {id}</p>
            <p>Varastossa: {stock}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BundlePage;
