import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Order, OrderDatabase } from '@/interfaces/order.interface';
import { getAdminDatabases } from '@/services/databases';
import { getLoggedInUser } from '@/services/userSession';

import Link from 'next/link';
//import { redirect } from "next/navigation";

const KooditPage = async () => {
  const user = await getLoggedInUser();

  if (!user || !user.labels.includes('admin')) {
    //redirect("/kirjaudu");
  }

  const database = await getAdminDatabases();

  const orders = await database.listDocuments<Order>(
    OrderDatabase.DatabaseId,
    OrderDatabase.CollectionId
  );

  return (
    <div>
      <h1>Listaus tilauksista</h1>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Tilausnumero</TableHead>
            <TableHead>Käytetty koodi</TableHead>
            <TableHead>Tila</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.documents.map((order) => (
            <TableRow key={order.$id}>
              <TableCell>
                <Link
                  href={`/hallinta/tilaukset/${order.$id}`}
                  className="text-blue-500 hover:underline"
                >
                  {order.$id}
                </Link>
              </TableCell>
              <TableCell>{order.orderCode.code}</TableCell>
              <TableCell>
                {order.shipped
                  ? 'Lähetetty'
                  : order.canceled
                    ? 'Peruutettu'
                    : 'Odottamassa'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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

export default KooditPage;
