import MarkdownToHtml from '@/components/MarkdownToHtml';
import { Heading } from '@/components/Text';
import { Article, ArticleDatabase } from '@/interfaces/article.interface';
import { getDocumentWithApi } from '@/services/databases';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  const { data } = await getDocumentWithApi<Article>(
    ArticleDatabase.DatabaseId,
    ArticleDatabase.CollectionId,
    slug
  );

  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6 text-card-foreground">
      <Heading.h1 className="mt-6 mb-4 text-4xl text-wrap">
        {data.title.toUpperCase()}
      </Heading.h1>
      <div className="flex flex-col gap-4">
        <MarkdownToHtml markdown={data.text} />
      </div>
    </div>
  );
};

export default Page;
