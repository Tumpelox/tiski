import { listDocuments } from '@/services/databases';
import TilauksetTable from './TilauksetTable';
import { Order, OrderDatabase } from '@/interfaces/order.interface';
import { redirect } from 'next/navigation';
import { Heading } from '@/components/Text';

const TilauksetPage = async () => {
  const { data } = await listDocuments<Order>(
    OrderDatabase.DatabaseId,
    OrderDatabase.CollectionId
  );

  if (!data) redirect('/');

  return (
    <div className="space-y-4">
      <Heading.h1>Listaus tilauksista</Heading.h1>
      <TilauksetTable orders={data} />
    </div>
  );
  // return (
  //   <div>
  //     <h1>Listaus tilauksista</h1>
  //     <p>
  //       Esimerkki: <Link href={`/hallinta/tilaukset/1234`}>1234</Link>
  //     </p>
  //     <p>
  //       <strong>Vain adminilla</strong>
  //     </p>
  //     <ul>
  //       <li>Tilausnumero</li>
  //       <li>Linkki tilauksen tietoihin</li>
  //       <li>Haku tilausnumerolla</li>
  //       <li>Tilausten filtteröinti tilan mukaan</li>
  //       <li>Tilausten pdf tulostus ilman yhteystietoja</li>
  //     </ul>
  //   </div>
  // );
};

export default TilauksetPage;
