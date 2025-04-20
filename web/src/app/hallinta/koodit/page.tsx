import Link from 'next/link';
import KooditTable from './KooditTable';
import { listDocuments } from '@/services/databases';
import { OrderCode, OrderCodeDatabase } from '@/interfaces/orderCode.interface';
import { redirect } from 'next/navigation';

const KooditPage = async () => {
  const { data } = await listDocuments<OrderCode>(
    OrderCodeDatabase.DatabaseId,
    OrderCodeDatabase.CollectionId
  );

  if (!data) redirect('/');

  return (
    <div className="container mx-auto">
      <h1>Listaus aktiivisista tilauskoodeista</h1>
      <KooditTable orderCodes={data} />
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
    </div>
  );
};

export default KooditPage;
