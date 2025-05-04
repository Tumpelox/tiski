import { MenuItem } from '@/interfaces/settings.interface';
import Link from 'next/link';
import Image from 'next/image';
import cloudImage from '../../assets/cloud3.webp';

const NavigationMenu = (props: { menuItems: MenuItem[] }) => {
  return (
    <div className="bg-gradient-to-b from-blue-30 to-blue-300 fixed inset-0 z-50 bg-white bg-opacity-95 flex flex-col items-center justify-center">
      <nav className="flex flex-col items-center gap-6">
        {props.menuItems.map((item) => (
          <Link
            key={item.$id}
            href={item.url}
            className="relative w-48 h-24 block"
          >
            <Image
              src={cloudImage}
              alt=""
              fill
              className="object-contain brightness-[200]"
            />
            <span className="absolute inset-0 flex items-center justify-center text-center text-xl font-semibold text-gray-800">
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default NavigationMenu;
