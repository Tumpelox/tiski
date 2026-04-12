import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import Image from 'next/image';

export const siluetVariants = cva(
  'absolute top-0 w-full -z-10 left-0 gradient',
  {
    variants: {
      height: {
        full: 'h-[100svh]',
        half: 'h-[50svh]',
      },
    },
    defaultVariants: {
      height: 'full',
    },
  }
);

const Siluet = ({
  height = 'full',
}: React.ComponentProps<'button'> & VariantProps<typeof siluetVariants>) => {
  return (
    <div className={cn(siluetVariants({ height }))}>
      <Image
        src="/siluetti.webp"
        alt="Siluet"
        width={3760}
        height={652}
        className="absolute object-cover object-left left-0 height-auto min-h-1/4 bottom-0"
        unoptimized={true}
      />
    </div>
  );
};

export default Siluet;
