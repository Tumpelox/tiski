import { MenuItem } from '@/interfaces/settings.interface';
import { CloudLink } from './CloudButton';

const NavigationMenu = ({
  items,
  children,
}: {
  items: MenuItem[];
  children?: React.ReactNode;
}) => {
  return (
    <nav className="flex flex-col md:flex-row md:w-fit items-center justify-center gap-4">
      {items.map((item) => (
        <CloudLink
          key={item.url}
          href={item.url}
          variant={'accent'}
          className="md:w-32 md:mt-0"
        >
          {item.name.toUpperCase()}
        </CloudLink>
      ))}
      {children}
    </nav>
  );
};

export default NavigationMenu;
