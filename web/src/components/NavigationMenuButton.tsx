'use client';

import React from 'react';
import navigationMenuButton from '../../assets/valikko.webp';

const NavigationMenuButton = (props: { children: React.ReactNode }) => {
  const [visible, setVisible] = React.useState(false);

  const toggleNavigationMenu = () => {
    setVisible((prev) => !prev);
  };

  return (
    <div>
      <button onClick={toggleNavigationMenu}>
        <img src={navigationMenuButton.src} alt="Valikko" />
      </button>
      {visible && (
        <div className="absolute top-0 right-0 bg-white shadow-lg p-4">
          <div className="flex flex-col gap-2">{props.children}</div>
        </div>
      )}
    </div>
  );
};

export default NavigationMenuButton;
