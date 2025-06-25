'use client';

import { cn } from '@/lib/utils';

import { ReactNode, useState } from 'react';

const TarraCard = ({ front, back }: { front: ReactNode; back: ReactNode }) => {
  const [toggle, setToggle] = useState(false);

  const cardClass =
    'absolute w-full h-full backface-hidden shadow text-secondary-foreground rounded';
  return (
    <div
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
        <div className={cn(cardClass, 'overflow-hidden')}>{front}</div>
        <div
          className={cn(
            cardClass,
            'rotate-y-180 p-4 select-none bg-card text-card-foreground'
          )}
        >
          {back}
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
