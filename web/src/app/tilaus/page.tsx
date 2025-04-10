import Cart from "@/components/Cart";
import { getOrderCode } from "@/services/orderCode";
import { getLoggedInUser } from "@/services/userSession";
import Link from "next/link";

const TilausPage = async () => {
  const user = await getLoggedInUser();
  const orderCode = user ? await getOrderCode(user.$id as string) : null;

  return (
    <div>
      <h1>Ns Ostoskori sivu</h1>
      <p>
        <Link href={"/tilaus/uusi"}>Uusi tilaus</Link>
      </p>
      <p>
        Tilauksen tarkastelu <Link href={"/tilaus/uusi"}>1234</Link>
      </p>
      <ul className="">
        <li>Tilauksen yhteenveto {"(client renderöinti)"}</li>
        <li>Käytettävän tilauskoodin syöttö jos linkkiä ei käytetty</li>
        <li>Aiemmat tilaukset ja linkki niihin</li>
      </ul>
      <Cart />
      <div>{orderCode ? <p>{orderCode.code}</p> : <p>Koodin syöttö</p>}</div>
    </div>
  );
};

export default TilausPage;
