'use client';

import { Product } from '@/interfaces/product.interface';
import { cn } from '@/lib/utils';

import Image from 'next/image';
import { useState } from 'react';

const TarraCard = ({ item }: { item: Product }) => {
  const [toggle, setToggle] = useState(false);
  const picture = (item as Product).pictures[0];
  const cardClass =
    'absolute w-full h-full backface-hidden shadow text-secondary-foreground';
  return (
    <div
      key={item.$id}
      className="perspective-distant bg-transparent aspect-square relative bg-transparent"
      onClick={() => setToggle(!toggle)}
    >
      <div
        className={cn(
          'relative w-full h-full cursor-pointer text-center transition-transform duration-500 transform-3d',
          {
            'rotate-y-180': toggle,
          }
        )}
      >
        <div className={cn(cardClass, 'overflow-hidden')}>
          <Image
            src={picture.src}
            width={picture.width}
            height={picture.height}
            alt={picture.alt}
            className="size-full"
          />
        </div>
        <div
          className={cn(
            cardClass,
            'rotate-y-180 flex flex-col items-center p-4 select-none bg-gradient-to-b from-secondary to-primary'
          )}
        >
          <h3 className="text-xl md:text-lg text-center my-2">{item.title}</h3>
          <p className="text-sm text-center">{item.description}</p>
        </div>
      </div>
      {/* <Button
        className={cn('absolute bottom-4 right-4')}
        onClick={() => setToggle(!toggle)}
      >
        <ArrowBigRightDash
          className={cn('size-6 transition-transform duration-500', {
            'rotate-x-180 rotate-y-180': toggle,
          })}
        />
      </Button> */}
    </div>
  );
};

export default TarraCard;
