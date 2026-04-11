import { ReactNode } from 'react';
import HallintaNavigation from './HallintaNavigation';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container max-w-5xl mx-auto pb-8 pt-4 px-4 sm:px-8 md:px-8 lg:px-0">
      <div className="space-y-4 py-2 px-4 bg-card text-card-foreground rounded-md">
        <HallintaNavigation />
        {children}
      </div>
    </div>
  );
};

export default Layout;
