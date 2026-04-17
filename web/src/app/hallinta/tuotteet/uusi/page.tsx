import { Heading } from '@/components/Text';
import UploadProduct from './CreateProduct';
import { getLoggedInUser } from '@/services/userSession';
import isAdmin from '@/lib/isAdmin';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const UusiFeedPage = async () => {
  const { user } = await getLoggedInUser();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center w-full">
        <Heading.h1>Luo uusi tuote</Heading.h1>
        <Link
          href={'/hallinta/tuotteet'}
          className={buttonVariants({ variant: 'default' })}
        >
          Takaisin <ArrowLeft className="size-4" />
        </Link>
      </div>

      {isAdmin(user) && (
        <div className="mb-4">
          <UploadProduct />
          {/* <RemoveUnusedUsers /> */}
        </div>
      )}
    </div>
  );
};

export default UusiFeedPage;
