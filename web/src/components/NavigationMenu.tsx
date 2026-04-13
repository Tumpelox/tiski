import { MenuItem } from '@/interfaces/settings.interface';
import { CloudLink } from './CloudButton';
import { Button } from './ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Facebook, Instagram } from 'lucide-react';

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
      <div className="flex gap-4">
        <Link
          href="https://www.instagram.com/tarratoimikunta/"
          className={cn('flex gap-2 text-xl font-semibold underline mt-2', {
            'md:w-32 md:w-3 md:mt-0': false,
          })}
        >
          <Instagram className="size-8" />
        </Link>
        <Link
          href="https://www.facebook.com/people/Tarratoimikunta/61584972506597/"
          className={cn('flex gap-2 text-xl font-semibold underline mt-2', {
            'md:w-32 md:w-3 md:mt-0': false,
          })}
        >
          <Facebook className="size-8" />
        </Link>
      </div>

      {children}
    </nav>
  );
};

export default NavigationMenu;
