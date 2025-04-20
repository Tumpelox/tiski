import { Order, OrderDatabase } from '@/interfaces/order.interface';
import { getDocument } from '@/services/databases';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ order: string }>;
}

const TilausYhteenvetoPage = async ({ params }: Props) => {
  const { order } = await params;

  const { data, error } = await getDocument<Order>(
    OrderDatabase.DatabaseId,
    OrderDatabase.CollectionId,
    order
  );

  if (error) notFound();

  return (
    <div>
      <h1>Tilauksen perustiedot</h1>
      <ul>
        <li>Tilausnumero: {JSON.stringify(data, null, 2)}</li>
        <li>Tilauksen tuotteet</li>
        <li>Tilauksen tila</li>
      </ul>
    </div>
  );
};

export default TilausYhteenvetoPage;
