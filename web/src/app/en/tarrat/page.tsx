import { Heading, Paragraph } from '@/components/Text';

import {
  Bundle,
  BundleDatabase,
  BundleDocument,
} from '@/interfaces/bundle.interface';

import { Product } from '@/interfaces/product.interface';
import { clientSideBundle } from '@/lib/clientSideProduct';
import { cn } from '@/lib/utils';
import { listDocumentsWithApi } from '@/services/databases';
import TarraCard from '../../../components/FlipCard';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Metadata } from 'next';
import defaultMetadata from '../../metadata';
import LanguageSwitch from '@/components/LanguageSwitch';

export async function generateMetadata(): Promise<Metadata | null> {
  return {
    title: 'Tarrat - Tarratoimikunta',
    description:
      'Tutustu Tarratoimikunnan suviseuroissa jakamiin tarroihin, joiden tarkoituksena on lempeästi ravistella yhteisön rakenteita ja havahduttaa yhteisön jäsenet keskustelemaan.',
    openGraph: {
      ...defaultMetadata.openGraph,
      title: 'Tarrat - Tarratoimikunta',
      description:
        'Tutustu Tarratoimikunnan suviseuroissa jakamiin tarroihin, joiden tarkoituksena on lempeästi ravistella yhteisön rakenteita ja havahduttaa yhteisön jäsenet keskustelemaan.',
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: 'Tarrat - Tarratoimikunta',
      description:
        'Tutustu Tarratoimikunnan suviseuroissa jakamiin tarroihin, joiden tarkoituksena on lempeästi ravistella yhteisön rakenteita ja havahduttaa yhteisön jäsenet keskustelemaan.',
    },
  };
}

const bundleIds = ['yhden-jakajan-paketti', 'en_2026'];

const getBundles = async () => {
  const { data } = await listDocumentsWithApi<BundleDocument>(
    BundleDatabase.DatabaseId,
    BundleDatabase.CollectionId
  );

  if (!data) {
    return [];
  }

  return data
    .filter((bundle) => bundle.products.length > 0)
    .filter((bundle) => bundleIds.includes(bundle.$id))
    .sort((a, b) => {
      return (
        new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      );
    })
    .map((bundle) => clientSideBundle(bundle));
};

const TarratPage = async () => {
  // const { user } = await getLoggedInUser();
  // const orderCode = await getOrderCode(user);
  const bundles = await getBundles();
  console.log(bundles);

  return (
    <div className="flex flex-col gap-10 text-accent-foreground">
      <LanguageSwitch href="/tarrat">FI</LanguageSwitch>
      <Heading.h1 className="text-center text-4xl md:text-5xl mt-4 uppercase">
        Stickers
      </Heading.h1>
      <Paragraph className="text-center text-lg md:text-xl italic">
        <span className="not-italic">ℹ️</span> On the back of the stickers,
        you'll find some background information about them
      </Paragraph>
      {bundles.map((bundle: Bundle) => {
        const products = bundle.products;
        return (
          <>
            <Heading.h2 className="text-center text-4xl md:text-5xl mt-4 uppercase">
              {bundle.title}
            </Heading.h2>
            <div
              key={bundle.$id}
              className={cn(
                'grid grid-cols-1 gap-4 w-full',
                'sm:grid-cols-2 md:grid-cols-3'
              )}
            >
              {products.map((product: Product) => (
                <TarraCard
                  key={product.$id}
                  front={
                    <Carousel>
                      <CarouselContent>
                        {product.pictures.map((picture, index) => (
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
                      <Paragraph className="md:text-sm text-left">
                        {product.description}
                      </Paragraph>
                    </div>
                  }
                />
              ))}
            </div>
          </>
        );
      })}
    </div>
  );
};

export default TarratPage;
