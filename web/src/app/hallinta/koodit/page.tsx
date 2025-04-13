import Link from 'next/link';

const KooditPage = () => {
  return (
    <div>
      <h1>Listaus aktiivisista tilauskoodeista</h1>
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
