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
import { exampleProduct } from '@/interfaces/product.interface';
import Image from 'next/image';

interface Props {
  params: Promise<{ id: string }>;
}

const TilausYhteenvetoPage = async ({ params }: Props) => {
  const { id } = await params;
  const { title, description, stock } = exampleProduct;

  const pictures = exampleProduct.pictures ?? [];
  const productPicture = pictures.length > 0;
  return (
    <div className="px-4 md:px-8 ">
      <Card className="max-w-5xl mx-auto">
        <CardContent className="flex flex-col md:grid md:grid-cols-5 gap-16">
          {productPicture && (
            <div className="col-span-3 px-10">
              <Carousel className="w-full">
                <CarouselContent>
                  {pictures.map((picture) => {
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
                <h2>{title}</h2>
                <p>{description}</p>
              </div>

              <AddToCard product={exampleProduct} />
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

export default TilausYhteenvetoPage;
