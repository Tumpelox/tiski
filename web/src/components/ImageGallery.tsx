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
    <Carousel className="w-full max-w-md">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Image
              src={image.src}
              alt={image.alt ?? ''}
              width={image.width}
              height={image.height}
              className="w-full rounded-md object-contain"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && <CarouselPrevious />}
      {images.length > 1 && <CarouselNext />}
    </Carousel>
  );
};

export default ImageGallery