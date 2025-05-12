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
      <Tag
        {...props}
        className={cn('text-foreground font-bold', defaultClassName, className)}
      >
        {children}
      </Tag>
    );
  };

  // Set a display name for better debugging in React DevTools
  Component.displayName = `Title.h${level}`;
  return Component;
};

// Define the specific heading components with their default styles
const H1 = createHeadingComponent(1, 'text-3xl'); // Original size
const H2 = createHeadingComponent(2, 'text-2xl');
const H3 = createHeadingComponent(3, 'text-xl');
const H4 = createHeadingComponent(4, 'text-lg');
const H5 = createHeadingComponent(5, 'text-base');
const H6 = createHeadingComponent(6, 'text-sm');

// The Title object will be the default export
const Title = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
};

export default Title;
