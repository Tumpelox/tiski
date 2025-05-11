'use client';

import React, { useEffect } from 'react';
import navigationMenuButton from '../../assets/valikko.webp';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

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
    <div className="relative">
      <Button
        onClick={toggleNavigationMenu}
        className="absolute md:hidden top-4 right-0 w-10 h-10 p-0 rounded z-50"
        variant="ghost"
      >
        <Image
          src={navigationMenuButton.src}
          alt="Valikko"
          className="w-full h-full object-contain"
          width={navigationMenuButton.width}
          height={navigationMenuButton.height}
        />
      </Button>

      <div
        className={`${!visible && 'hidden md:flex'} fixed md:relative z-40 top-0 right-0 h-screen md:h-fit w-dvw md:w-full flex flex-col md:flex-row gap-4 items-center justify-center md:justify-end bg-gradient-to-b md:bg-none from-white to-blue-300 md:py-2`}
      >
        {props.children}
      </div>
    </div>
  );
};

export default NavigationMenuButton;
