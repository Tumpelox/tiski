import { ReactNode } from 'react';
import HallintaNavigation from './HallintaNavigation';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="space-y-4 py-2 px-4 bg-card text-card-foreground rounded-md">
      <HallintaNavigation />
      {children}
    </div>
  );
};

export default Layout;
