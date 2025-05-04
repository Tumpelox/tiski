'use client';

import React from 'react';
import navigationMenuButton from '../../assets/valikko.webp';
import { Button } from '@/components/ui/button';

const NavigationMenuButton = (props: { children: React.ReactNode }) => {
  const [visible, setVisible] = React.useState(false);

  const toggleNavigationMenu = () => {
    setVisible((prev) => !prev);
  };

  return (
    <div>
      <Button
        onClick={toggleNavigationMenu}
        className="absolute top-4 right-4 w-10 h-10 p-0 rounded"
        variant="ghost"
      >
        <img
          src={navigationMenuButton.src}
          alt="Valikko"
          className="w-full h-full object-contain"
        />
      </Button>
      {visible && (
        <div className="absolute top-0 right-0 bg-white shadow-lg p-4">
          <div className="flex flex-col gap-2">{props.children}</div>
        </div>
      )}
    </div>
  );
};

export default NavigationMenuButton;
