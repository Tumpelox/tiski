import { MenuItem } from '@/interfaces/settings.interface';
import Link from 'next/link';

const NavigationMenu = (props: { menuItems: MenuItem[] }) => {
  return (
    <div>
      <nav className="bg-yellow-300">
        <ul>
          {props.menuItems.map((item) => (
            <li key={item.$id}>
              <Link href={item.url}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default NavigationMenu;
