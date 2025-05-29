import MarkdownToHtml from '@/components/MarkdownToHtml';
import { Heading } from '@/components/Text';
import { Card, CardContent } from '@/components/ui/card';
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
    <div>
      <Heading.h1 className="text-accent-foreground mt-6 mb-4 text-4xl text-wrap">
        {data.title}
      </Heading.h1>
      <Card>
        <CardContent>
          <MarkdownToHtml markdown={data.text} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
