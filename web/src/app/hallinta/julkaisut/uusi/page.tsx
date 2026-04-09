import { Heading } from '@/components/Text';
import UploadFeed from './UploadFeed';
import { getLoggedInUser } from '@/services/userSession';
import isAdmin from '@/lib/isAdmin';

const UusiFeedPage = async () => {
  const { user } = await getLoggedInUser();

  return (
    <div className="space-y-4">
      <Heading.h1>Luo uusi julkaisu</Heading.h1>
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
