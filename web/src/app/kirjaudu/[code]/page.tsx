import AutoLoginWithCode from './AutoLoginWithCode';

interface Props {
  params: Promise<{ code: string }>;
}

const MagicPage = async ({ params }: Props) => {
  const { code } = await params;

  return <AutoLoginWithCode code={code} />;
};

export default MagicPage;
