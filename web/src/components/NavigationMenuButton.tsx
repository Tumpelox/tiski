'use client';

import React, { useEffect } from 'react';
import navigationMenuButton from '../../assets/valikko.webp';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

const NavigationMenuButton = (props: { children: React.ReactNode }) => {
  const [visible, setVisible] = React.useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setVisible(false);
  }, [pathname]);

  const toggleNavigationMenu = () => {
    setVisible((prev) => !prev);
  };

  return (
    <div>
      <Button
        onClick={toggleNavigationMenu}
        className="absolute top-4 right-4 w-10 h-10 p-0 rounded z-50"
        variant="ghost"
      >
        <img
          src={navigationMenuButton.src}
          alt="Valikko"
          className="w-full h-full object-contain"
        />
      </Button>
      {visible && (
        <div className="absolute top-0 right-0 bg-white shadow-lg p-4 z-40">
          <div className="flex flex-col gap-2">{props.children}</div>
        </div>
      )}
    </div>
  );
};

export default NavigationMenuButton;
