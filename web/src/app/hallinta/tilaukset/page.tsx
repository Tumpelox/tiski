import Link from 'next/link';

const KooditPage = () => {
  return (
    <div>
      <h1>Listaus tilauksista</h1>
      <p>
        Esimerkki: <Link href={`/hallinta/tilaukset/1234`}>1234</Link>
      </p>
      <p>
        <strong>Vain adminilla</strong>
      </p>
      <ul>
        <li>Tilausnumero</li>
        <li>Linkki tilauksen tietoihin</li>
        <li>Haku tilausnumerolla</li>
        <li>Tilausten filtteröinti tilan mukaan</li>
        <li>Tilausten pdf tulostus ilman yhteystietoja</li>
      </ul>
    </div>
  );
};

export default KooditPage;
