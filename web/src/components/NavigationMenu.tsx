import { MenuItem } from '@/interfaces/settings.interface';
import Link from 'next/link';
import Image from 'next/image';
import cloudImage from '../../assets/cloud3.webp';

const NavigationMenu = (props: { menuItems: MenuItem[] }) => {
  return (
    <nav className="flex flex-col md:flex-row md:w-fit items-center justify-center gap-4">
      {props.menuItems.map((item) => (
        <Link
          key={item.$id}
          href={item.url}
          className="relative w-48 h-24 md:w-24 md:h-12 block"
        >
          <Image
            src={cloudImage}
            alt=""
            fill
            className="object-contain brightness-[200]"
          />
          <span className="absolute inset-0 flex items-center justify-center text-center text-xl md:text-base font-semibold text-gray-800">
            {item.name}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default NavigationMenu;
