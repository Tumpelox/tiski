import Link from 'next/link';

const LanguageSwitch = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="absolute left-4 top-4 z-50">
      <Link
        href={href}
        className="text-sm font-semibold text-current underline underline-offset-4"
      >
        {children}
      </Link>
    </div>
  );
};

export default LanguageSwitch;
