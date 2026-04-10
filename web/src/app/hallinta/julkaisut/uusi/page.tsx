import { Heading } from '@/components/Text';
import UploadFeed from './UploadFeed';
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
        <Heading.h1>Luo uusi julkaisu</Heading.h1>
        <Link
          href={'/hallinta/julkaisut'}
          className={buttonVariants({ variant: 'default' })}
        >
          Takaisin <ArrowLeft className="size-4" />
        </Link>
      </div>

      {isAdmin(user) && (
        <div className="mb-4">
          <UploadFeed />
          {/* <RemoveUnusedUsers /> */}
        </div>
      )}
    </div>
  );
};

export default UusiFeedPage;
