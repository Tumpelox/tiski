import { Order, OrderDatabase } from "@/interfaces/order.interface";
import { getAdminDatabases } from "@/services/databases";

interface Props {
  params: Promise<{ orderId: string }>;
}

const TilausYhteenvetoPage = async ({ params }: Props) => {
  const { orderId } = await params;

  const databases = await getAdminDatabases();
  const order = await databases.getDocument<Order>(
    OrderDatabase.DatabaseId,
    OrderDatabase.CollectionId,
    orderId
  );
  return (
    <div>
      <h1>Tilauksen perustiedot</h1>
      <p>
        <strong>Vain adminilla</strong>
      </p>
      <ul>
        <li>Tilausnumero: {order.$id}</li>
        <li>
          Tilauksen tuotteet {order.products.map((product) => product.$id)}
        </li>
        <li>
          Tilauksen tila{" "}
          {order.shipped ? "Lähetetty" : order.canceled ? "Peruttu" : "Odottaa"}
        </li>
        <li>Tilauksen yhteystiedot</li>
      </ul>
    </div>
  );
};

export default TilausYhteenvetoPage;
