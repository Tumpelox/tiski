import { ReactNode } from 'react';
import HallintaNavigation from './HallintaNavigation';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <HallintaNavigation />
      {children}
    </>
  );
};

export default Layout;
