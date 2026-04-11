'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';

type Image = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

interface ImageGalleryProps {
  images: Image[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (!images?.length) return null;

  return (
    <Carousel className="gradient rounded-md shadow-lg">
      <CarouselContent>
        {images.toReversed().map((image, index) => (
          <CarouselItem key={index}>
            <Image
              src={image.src}
              alt={image.alt ?? ''}
              width={image.width}
              height={image.height}
              className="rounded-md aspect-[4/5] object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && <CarouselPrevious />}
      {images.length > 1 && <CarouselNext />}
    </Carousel>
  );
};

export default ImageGallery;
