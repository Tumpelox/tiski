interface Props {
  params: Promise<{ code: string }>;
}

const KooditPage = async ({ params }: Props) => {
  const { code } = await params;
  return (
    <div>
      <h1>Tilauskoodin tiedot</h1>
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
