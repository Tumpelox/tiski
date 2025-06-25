'use client';

import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

import Link from 'next/link';

// interface CloudGraphicProps extends React.SVGProps<SVGSVGElement> {
//   // fillColor?: string;
// }

export const CloudGraphic = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 732.307 413.25"
      {...props}
    >
      <g id="g1" transform="translate(-.197 15.741)">
        <path
          id="path1"
          fill="currentColor"
          d="M420.571 394.917c-22.7-4.16-45.386-12.942-63.716-24.667-7.67-4.907-7.67-4.907-15.958-2.347-50.157 15.492-114.612 1.738-157.296-33.564-6.399-5.292-6.399-5.292-12.348-1.02-42.82 30.751-102.95 24.999-140.403-13.432-63.978-65.648-21.643-176.527 70.048-183.462 9.021-.682 9.769-.968 9.769-3.737 0-7.54 8.307-35.023 14.512-48.014C180.082-30.261 328.863-50.663 414.701 44.972c6.035 6.723 6.035 6.723 20.64 5.34 58.617-5.554 119.008 21.791 154.195 69.82 6.394 8.728 6.394 8.728 19.876 6.751 72.627-10.648 134.595 54.634 121.278 127.764-11.098 60.94-75.828 101.094-135.759 84.213-11.068-3.118-11.068-3.118-21.333 6.834-41.813 40.54-99.37 59.054-153.027 49.223"
        ></path>
      </g>
    </svg>
  );
};

interface CloudButtonLink
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  small?: boolean;
  variant?: VariantProps<typeof backgroundVariants>['variant'];
  size?: VariantProps<typeof backgroundVariants>['size'];
  children: React.ReactNode;
  className?: string;
}

interface CloudButtonButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  small?: boolean;
  variant?: VariantProps<typeof backgroundVariants>['variant'];
  size?: VariantProps<typeof backgroundVariants>['size'];
  children: React.ReactNode;
  className?: string;
}

const backgroundVariants = cva(
  'relative block text-center transition-transform hover:-translate-y-1 hover:saturate-150 mt-4',
  {
    variants: {
      size: {
        default: 'w-40 tracking-widest',
        small: 'w-28',
        large: 'w-52 tracking-widest',
      },
      variant: {
        primary: 'text-primary hover:text-primary/80',
        secondary: 'text-secondary hover:text-secondary/80',
        destructive: 'text-destructive hover:text-destructive/80',
        accent: 'text-accent hover:text-accent/80',
        card: 'text-card hover:text-card/80',
      },
    },
    defaultVariants: { size: 'default', variant: 'primary' },
  }
);

const textVariants = cva(
  'absolute inset-0 top-[13%] flex items-center justify-center text-primary-foreground',
  {
    variants: {
      size: {
        default: 'text-base',
        small: 'text-sm',
        large: 'text-lg',
      },
      variant: {
        primary: 'text-primary-foreground',
        secondary: 'text-secondary-foreground',
        destructive: 'text-destructive-foreground',
        accent: 'text-accent-foreground',
        card: 'text-card-foreground',
      },
    },
    defaultVariants: { size: 'default', variant: 'primary' },
  }
);

const CloudLink = ({
  small = false,
  children,
  className = '',
  variant = 'primary',
  size = 'default',
  ...linkProps
}: CloudButtonLink) => {
  return (
    <Link
      href={linkProps.href as string}
      {...linkProps}
      className={cn(
        backgroundVariants({ size: small ? 'small' : size, variant }),
        className
      )}
    >
      <CloudGraphic className="object-contain" />
      <span
        className={cn(textVariants({ size: small ? 'small' : size, variant }))}
      >
        {children}
      </span>
    </Link>
  );
};

const CloudButton = ({
  small = false,
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  ...buttonProps
}: CloudButtonButton) => {
  return (
    <button
      {...buttonProps}
      className={cn(
        backgroundVariants({ size: small ? 'small' : size, variant }),
        className
      )}
    >
      <CloudGraphic className="object-contain" />
      <span
        className={cn(textVariants({ size: small ? 'small' : size, variant }))}
      >
        {children}
      </span>
    </button>
  );
};

export { CloudLink, CloudButton };
