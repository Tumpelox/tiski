import { OrderCode, OrderCodeDatabase } from '@/interfaces/orderCode.interface';
import { getDocument } from '@/services/databases';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ code: string }>;
}

const KooditPage = async ({ params }: Props) => {
  const { code } = await params;

  const { data } = await getDocument<OrderCode>(
    OrderCodeDatabase.DatabaseId,
    OrderCodeDatabase.CollectionId,
    code
  );

  if (!data) notFound();

  return (
    <div>
      <h1>Tilauskoodin tiedot</h1>
      {data.code}
      <ul>
        <li>Pääsy vain admineilla</li>
        <li>Koodin tekijä</li>
        <li>Linkit koodilla tehtyihin tilauksiin</li>
        <li>Koodin aktiivisuus</li>
        <li>Koodilla tehdyt tilaukset</li>
        <li>Koodi: {code}</li>
      </ul>
    </div>
  );
};

export default KooditPage;
