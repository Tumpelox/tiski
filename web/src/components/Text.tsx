import { cn } from '@/lib/utils';
import { JSX } from 'react/jsx-runtime';

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

interface TitleComponent {
  h1: JSX.IntrinsicElements['h1'];
  h2: JSX.IntrinsicElements['h2'];
  h3: JSX.IntrinsicElements['h3'];
  h4: JSX.IntrinsicElements['h4'];
  h5: JSX.IntrinsicElements['h5'];
  h6: JSX.IntrinsicElements['h6'];
}

// Helper function to create styled heading components
const createHeadingComponent = (
  level: 1 | 2 | 3 | 4 | 5 | 6,
  defaultClassName: string
) => {
  const Tag = `h${level}` as keyof TitleComponent;

  const Component = ({ children, className, ...props }: TitleProps) => {
    return (
      <Tag {...props} className={cn('font-bold', defaultClassName, className)}>
        {children}
      </Tag>
    );
  };

  Component.displayName = `Heading.h${level}`;
  return Component;
};

// Define the specific heading components with their default styles
const H1 = createHeadingComponent(1, 'text-3xl mt-2'); // Original size
const H2 = createHeadingComponent(2, 'text-2xl mt-2');
const H3 = createHeadingComponent(3, 'text-xl  mt-1');
const H4 = createHeadingComponent(4, 'text-lg  mt-1');
const H5 = createHeadingComponent(5, 'text-base mt-0.5');
const H6 = createHeadingComponent(6, 'text-sm mt-0.5');

// The Title object will be the default export
const Heading = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
};

const Paragraph = ({
  children,
  className,
  ...props
}: React.ComponentProps<'p'>) => {
  return (
    <p {...props} className={cn(className)}>
      {children}
    </p>
  );
};

export { Heading, Paragraph };
