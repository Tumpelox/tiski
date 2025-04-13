interface Props {
  params: Promise<{ slug: string }>;
}

const TilausYhteenvetoPage = async ({ params }: Props) => {
  const { slug } = await params;
  console.log('Sivu: ' + slug);
  return (
    <div>
      <h1>Artikkelisivu</h1>
      <ul>
        <li>Muutos markdownista html muotoon</li>
      </ul>
    </div>
  );
};

export default TilausYhteenvetoPage;
