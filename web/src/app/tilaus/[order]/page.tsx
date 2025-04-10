interface Props {
  params: Promise<{ order: string }>;
}

const TilausYhteenvetoPage = async ({ params }: Props) => {
  const { order } = await params;
  return (
    <div>
      <h1>Tilauksen perustiedot</h1>
      <ul>
        <li>Tilausnumero: {order}</li>
        <li>Tilauksen tuotteet</li>
        <li>Tilauksen tila</li>
      </ul>
    </div>
  );
};

export default TilausYhteenvetoPage;
