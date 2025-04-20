import { getDocument } from '@/services/databases';
import TextEditor from './TextEditor';
import { Article, ArticleDatabase } from '@/interfaces/article.interface';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

const SivutHallintaPage = async ({ params }: Props) => {
  const { slug } = await params;

  const { data } = await getDocument<Article>(
    ArticleDatabase.DatabaseId,
    ArticleDatabase.CollectionId,
    slug
  );

  if (!data) notFound();

  return <TextEditor data={data} />;
};

export default SivutHallintaPage;
