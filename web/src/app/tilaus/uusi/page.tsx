import Order from "@/components/Order";

const UusiTilausPage = async () => {
  // Tilauksen luonti tapahtuu käyttäjän selaimessa
  return (
    <div>
      <h1>Uusi tilaus</h1>
      <Order />
    </div>
  );
};

export default UusiTilausPage;
