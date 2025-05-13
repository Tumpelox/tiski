import { ReactNode } from 'react';
import HallintaNavigation from './HallintaNavigation';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="space-y-4 text-accent-foreground ">
      <HallintaNavigation />
      {children}
    </div>
  );
};

export default Layout;
