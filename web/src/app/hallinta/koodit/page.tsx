import KooditTable from './KooditTable';
import { listDocuments } from '@/services/databases';
import { OrderCode, OrderCodeDatabase } from '@/interfaces/orderCode.interface';
import { redirect } from 'next/navigation';
import CreateNewCode from './CreateNewCode';
import { getLoggedInUser } from '@/services/userSession';
import isAdmin from '@/lib/isAdmin';
import { Heading } from '@/components/Text';
import { Card, CardContent } from '@/components/ui/card';
import { Query } from 'node-appwrite';

const KooditPage = async () => {
  const { user } = await getLoggedInUser();

  const { data } = await listDocuments<OrderCode>(
    OrderCodeDatabase.DatabaseId,
    OrderCodeDatabase.CollectionId,
    [Query.limit(200)]
  );

  if (!data) redirect('/');

  return (
    <div className="space-y-4">
      <Heading.h1>Listaus aktiivisista tilauskoodeista</Heading.h1>
      <Card>
        <CardContent>
          {isAdmin(user) && (
            <div className="mb-4">
              <CreateNewCode />
            </div>
          )}
          <KooditTable orderCodes={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default KooditPage;
