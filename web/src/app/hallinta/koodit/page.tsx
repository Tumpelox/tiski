import Link from 'next/link';
import KooditTable from './KooditTable';
import { listDocuments } from '@/services/databases';
import { OrderCode, OrderCodeDatabase } from '@/interfaces/orderCode.interface';
import { redirect } from 'next/navigation';
import CreateNewCode from './CreateNewCode';
import { getLoggedInUser } from '@/services/userSession';
import isAdmin from '@/lib/isAdmin';
import { Heading } from '@/components/Text';
import { Card, CardContent } from '@/components/ui/card';

const KooditPage = async () => {
  const user = await getLoggedInUser();

  const { data } = await listDocuments<OrderCode>(
    OrderCodeDatabase.DatabaseId,
    OrderCodeDatabase.CollectionId
  );

  if (!data) redirect('/');

  return (
    <div className="space-y-4">
      <Heading.h1>Listaus aktiivisista tilauskoodeista</Heading.h1>
      <Card>
        <CardContent>
          <KooditTable orderCodes={data} />
          {isAdmin(user) && (
            <div className="mt-4">
              <CreateNewCode />
            </div>
          )}
          <p>
            Esimerkki: <Link href={`/hallinta/koodit/1234`}>1234</Link>
          </p>
          <p>
            <strong>Vain adminilla:</strong>
          </p>
          <ul>
            <li>Pääsy vain admineilla</li>
            <li>Koodin tekijä</li>
            <li>Linkki koodin tietoihin</li>
            <li>Koodin aktiivisuus</li>
            <li>Koodilla tehdyt tilaukset?</li>
            <li>Filtteröinti aktiivisuuden mukaan</li>
            <li>Koodin aktiivisuuden muuttaminen</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default KooditPage;
