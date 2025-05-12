'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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
            <Link
              href="/hallinta/tilaukset"
              className="flex items-center space-x-2"
              legacyBehavior
              passHref
            >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Tilaukset
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default HallintaNavigation;
