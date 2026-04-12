import { MenuItem } from '@/interfaces/settings.interface';
import { CloudLink } from './CloudButton';
import { Button } from './ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const NavigationMenu = ({
  items,
  children,
}: {
  items: MenuItem[];
  children?: React.ReactNode;
}) => {
  return (
    <nav
      className={cn('flex flex-col items-center justify-center gap-8', {
        'md:flex-row md:w-fit': false,
      })}
    >
      {items.map((item) => (
        <Link
          key={item.url}
          href={item.url}
          className={cn('text-2xl font-semibold mt-2', {
            'md:w-32 md:w-3 md:mt-0': false,
          })}
        >
          {item.name.toUpperCase()}
        </Link>
      ))}
      {children}
    </nav>
  );
};

export default NavigationMenu;
