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
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              href="/hallinta/sivut"
              className="flex items-center space-x-2"
              legacyBehavior
              passHref
            >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Sivut
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/hallinta/koodit"
              className="flex items-center space-x-2"
              legacyBehavior
              passHref
            >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Koodit
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Link
                href="/hallinta/tilaukset"
                className="flex items-center space-x-2"
                legacyBehavior
                passHref
              >
                Tilaukset
              </Link>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <Link
                href="/hallinta/tilaukset/tuote"
                className="flex items-center space-x-2"
                legacyBehavior
                passHref
              >
                <NavigationMenuLink>Tuotteittain</NavigationMenuLink>
              </Link>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/hallinta/kuvat"
              className="flex items-center space-x-2"
              legacyBehavior
              passHref
            >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Kuvat
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/hallinta/tuotteet"
              className="flex items-center space-x-2"
              legacyBehavior
              passHref
            >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Tuotteet
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default HallintaNavigation;
