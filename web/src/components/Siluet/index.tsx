import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import Image from 'next/image';

export const siluetVariants = cva(
  'absolute top-[calc(var(--spacing)*-16)] md:top-[calc(var(--spacing)*-22)] w-full -z-10 left-0 gradient',
  {
    variants: {
      height: {
        full: 'h-[100svh]',
        half: 'h-[45svh]',
      },
      variant: {
        default: '',
        secondary: '',
      },
    },
    defaultVariants: {
      height: 'full',
      variant: 'default',
    },
  }
);

export const siluetWrapperVariants = cva(
  'relative flex flex-col grow z-20 text-center justify-center',
  {
    variants: {
      height: {
        full: 'min-h-[calc(100svh-var(--spacing)*16)] md:min-h-[calc(100svh-var(--spacing)*22)]',
        half: 'min-h-[calc(45svh-var(--spacing)*16)] md:min-h-[calc(45svh-var(--spacing)*22)] lg:justify-end lg:pb-4 xl:pb-8',
      },
      variant: {
        default: 'mb-36',
        secondary: '',
      },
    },
    defaultVariants: {
      height: 'full',
      variant: 'default',
    },
  }
);

const Siluet = ({
  height = 'full',
  variant = 'default',
  children,
}: React.ComponentProps<'button'> & VariantProps<typeof siluetVariants>) => {
  return (
    <div className={cn(siluetWrapperVariants({ height, variant }))}>
      {children}
      <div className={cn(siluetVariants({ height, variant }))}>
        <Image
          src="/siluetti.webp"
          alt="Siluet"
          width={3760}
          height={652}
          className="absolute object-cover object-left left-0 height-auto min-h-1/4 bottom-0"
          loading="eager"
          unoptimized={true}
        />
      </div>
      {variant === 'default' && (
        <div className="absolute h-36 -bottom-36 left-0 w-full gradient-from-background-to-transparent"></div>
      )}
    </div>
  );
};

export default Siluet;
