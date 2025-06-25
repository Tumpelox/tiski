import { Heading, Paragraph } from '@/components/Text';

import { Bundle } from '@/interfaces/bundle.interface';

import {
  Product,
  ProductDatabase,
  ProductDocument,
} from '@/interfaces/product.interface';
import { clientSideProduct } from '@/lib/clientSideProduct';
import { cn } from '@/lib/utils';
import { listDocumentsWithApi } from '@/services/databases';
import { Suspense } from 'react';
import TarraCard from '../../components/FlipCard';
import Image from 'next/image';
import { UnifrakturCook } from 'next/font/google';
import { CloudLink } from '@/components/CloudButton';
import { Link } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const unifrakturCook = UnifrakturCook({
  weight: '700',
  subsets: ['latin'],
});

const getProducts = async () => {
  const { data } = await listDocumentsWithApi<ProductDocument>(
    ProductDatabase.DatabaseId,
    ProductDatabase.CollectionId
  );

  if (!data) {
    return [];
  }

  return data
    .filter((product) => product.hidden === false)
    .map((product) => clientSideProduct(product));
};

const TarratPage = async () => {
  // const { user } = await getLoggedInUser();
  // const orderCode = await getOrderCode(user);
  const products = await getProducts();

  const items = [...products];

  return (
    <div className="flex flex-col gap-10 text-accent-foreground">
      <Heading.h1 className="text-center text-4xl md:text-5xl mt-4">
        TARRAT
      </Heading.h1>
      <Paragraph className="text-center text-lg md:text-xl italic">
        <span className="not-italic">ℹ️</span> Tarrojen kääntöpuolelta löydät
        ajatuksia tarrojen taustoista
      </Paragraph>
      <div
        className={cn('grid grid-cols-1 gap-4 w-full', {
          'sm:grid-cols-1': items.length === 1,
          'sm:grid-cols-2': items.length === 2,
          'sm:grid-cols-2 md:grid-cols-3': items.length >= 3,
        })}
      >
        <Suspense fallback={<div>Ladataan tarroja...</div>}>
          {items.map((item: Product | Bundle) => {
            if (Object.hasOwn(item, 'pictures')) {
              return (
                <TarraCard
                  key={item.$id}
                  front={
                    <Carousel>
                      <CarouselContent>
                        {(item as Product).pictures.map((picture, index) => (
                          <CarouselItem key={picture.src + index}>
                            <Image
                              src={picture.src}
                              width={picture.width}
                              height={picture.height}
                              alt={picture.alt}
                              className="size-full"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  }
                  back={
                    <div className="flex flex-col justify-center h-full">
                      <Paragraph className="text-lg sm:text-base md:text-sm text-left">
                        {item.description}
                      </Paragraph>
                    </div>
                  }
                />
              );
            }
          })}
        </Suspense>
        <TarraCard
          front={
            <div
              className={`${unifrakturCook.className} h-full flex flex-col justify-center items-center bg-white text-black`}
            >
              <Paragraph className="text-center text-5xl sm:text-3xl">
                Seksuaalioikeuksien julistus
              </Paragraph>
            </div>
          }
          back={
            <div className="h-full flex flex-col items-center justify-center">
              <CloudLink
                variant={'card'}
                size={'large'}
                href="https://www.worldsexualhealth.net/_files/ugd/793f03_8f71ab092a2e43939aa88f72690d87d0.pdf"
                className="text-2xl sm:text-xl md:text-lg"
              >
                Avaa PDF
                <Link className="ml-2" />
              </CloudLink>
            </div>
          }
        />
        {/* <TarraCard
          front={
            <div
              className={`${unifrakturCook.className} h-full flex flex-col justify-center items-center bg-white text-black`}
            >
              <Paragraph className="text-center text-5xl sm:text-3xl">
                Lasten oikeuksien julistus
              </Paragraph>
            </div>
          }
          back={
            <div className="h-full flex flex-col items-center justify-center">
              <CloudLink
                variant={'card'}
                size={'large'}
                href="https://www.unicef.fi/tyomme/lapsen-oikeudet/lapsen-oikeuksien-sopimus/lapsen-oikeuksien-sopimus-tiivistettyna/"
                className="text-2xl sm:text-xl md:text-lg"
              >
                Avaa sivu
                <Link className="ml-2" />
              </CloudLink>
            </div>
          }
        /> */}
        <TarraCard
          front={
            <div
              className={`${unifrakturCook.className} h-full flex flex-col justify-center items-center bg-white text-black`}
            >
              <Paragraph className="text-center text-5xl sm:text-3xl">
                Tietoa hengellisestä väkivallasta
              </Paragraph>
            </div>
          }
          back={
            <div className="h-full flex flex-col items-center justify-center">
              <CloudLink
                variant={'card'}
                size={'large'}
                href="https://www.mielenterveystalo.fi/fi/omahoito/uskonnollisesta-yhteisosta-irtautumisen-omahoito-ohjelma/mita-hengellinen-vakivalta"
                className="text-2xl sm:text-xl md:text-lg"
              >
                Lue lisää
                <Link className="ml-2" />
              </CloudLink>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default TarratPage;
