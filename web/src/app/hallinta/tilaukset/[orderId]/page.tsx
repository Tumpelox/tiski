import { Order, OrderDatabase } from '@/interfaces/order.interface';

import { getDocument } from '@/services/databases';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ orderId: string }>;
}

const TilausYhteenvetoPage = async ({ params }: Props) => {
  const { orderId } = await params;

  const { data } = await getDocument<Order>(
    OrderDatabase.DatabaseId,
    OrderDatabase.CollectionId,
    orderId
  );

  if (!data) notFound();

  return (
    <div>
      <h1>Tilauksen perustiedot</h1>
      {data.$permissions}
      <p>
        <strong>Vain adminilla</strong>
      </p>
      <ul>
        <li>Tilausnumero: {data.$id}</li>
        <li>
          Tilauksen tuotteet {data.products.map((product) => product.$id)}
        </li>
        <li>
          Tilauksen tila{' '}
          {data.shipped ? 'Lähetetty' : data.canceled ? 'Peruttu' : 'Odottaa'}
        </li>
        <li>Tilauksen yhteystiedot</li>
        {data.contacts && JSON.stringify(data.contacts)}
      </ul>
    </div>
  );
};

export default TilausYhteenvetoPage;
