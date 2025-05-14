'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

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
      <button
        name="Päävalikko"
        title="Päävalikko"
        className={cn(
          {
            'absolute text-secondary-foreground': visible,
            'drop-shadow-md absolute text-background': !visible,
          },
          'md:hidden size-10 z-50 top-1 right-0 m-2'
        )}
        onClick={toggleNavigationMenu}
      >
        <div
          className={`h-[7%] rounded-sm left-0 block absolute duration-standard bg-current transition-[rotate] ${visible ? 'rotate-[135deg] w-[85%]' : 'top-1/6 w-[85%]'}`}
        ></div>
        <div
          className={`h-[7%] rounded-sm left-0 block absolute duration-standard bg-current transition-[rotate] ${visible ? 'rotate-45 w-[85%]' : 'w-[75%]'}`}
        ></div>
        <div
          className={`h-[7%] rounded-sm left-0 block absolute duration-standard bg-current transition-[rotate] ${visible ? 'rotate-[135deg] w-[85%]' : 'bottom-1/6 translate-y-full w-full'}`}
        ></div>
      </button>

      <div
        className={`${!visible && 'hidden md:flex'} fixed md:relative z-40 top-0 right-0 h-screen md:h-fit w-full bg-gradient-to-b md:bg-none from-secondary to-primary`}
      >
        <div className="h-dvh md:h-fit w-full flex flex-col md:flex-row gap-5 items-center justify-center md:py-2">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default NavigationMenuButton;
