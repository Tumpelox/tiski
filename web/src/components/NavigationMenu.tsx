import { MenuItem } from '@/interfaces/settings.interface';
import CloudButton from './CloudButton';

const NavigationMenu = ({
  items,
  children,
}: {
  items: MenuItem[];
  children?: React.ReactNode;
}) => {
  return (
    <nav className="flex flex-col md:flex-row md:w-fit items-center justify-center gap-6">
      {items.map((item) => (
        <CloudButton
          key={item.url}
          link={{ href: item.url }}
          backgroundColor="white"
        >
          {item.name.toUpperCase()}
        </CloudButton>
      ))}
      {children}
    </nav>
  );
};

export default NavigationMenu;
