'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

const HallintaNavigation = () => {
  return (
    <div className="w-full text-secondary-foreground">
      <NavigationMenu>
        <NavigationMenuList className="grid grid-cols-3 gap-4 md:flex md:gap-1">
          <NavigationMenuItem>
            <Link
              href="/hallinta/sivut"
              className={navigationMenuTriggerStyle()}
              passHref
            >
              Sivut
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/hallinta/koodit"
              className={navigationMenuTriggerStyle()}
              passHref
            >
              Koodit
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Link
                href="/hallinta/tilaukset"
                className={navigationMenuTriggerStyle()}
                passHref
              >
                Tilaukset
              </Link>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <Link
                href="/hallinta/tilaukset/tuote"
                className={navigationMenuTriggerStyle()}
                passHref
              >
                Tuotteittain
              </Link>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/hallinta/kuvat"
              className={navigationMenuTriggerStyle()}
              passHref
            >
              Kuvat
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/hallinta/tuotteet"
              className={navigationMenuTriggerStyle()}
              passHref
            >
              Tuotteet
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/hallinta/julkaisut"
              className={navigationMenuTriggerStyle()}
              passHref
            >
              Julkaisut
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default HallintaNavigation;
