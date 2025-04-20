import { Article, ArticleDatabase } from '@/interfaces/article.interface';
import { getDocumentWithApi } from '@/services/databases';
import Markdown from 'markdown-to-jsx';
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
      <Markdown
        options={{
          overrides: {
            h1: {
              component: 'h1',
              props: {
                className: 'text-2xl font-semibold my-4', // Example Tailwind classes for h1
              },
            },
            h2: {
              component: 'h2',
              props: {
                className: 'text-xl font-semibold my-3', // Example Tailwind classes for h2
              },
            },
            p: {
              component: 'p',
              props: {
                className: 'mb-4 leading-relaxed', // Example Tailwind classes for p
              },
            },
            ul: {
              component: 'ul',
              props: {
                className: 'list-disc list-inside mb-4 pl-4', // Example Tailwind classes for ul
              },
            },
            li: {
              component: 'li',
              props: {
                className: 'mb-1', // Example Tailwind classes for li
              },
            },
            a: {
              component: 'a',
              props: {
                className: 'text-blue-600 hover:underline', // Example Tailwind classes for a
              },
            },
            // Add more overrides for other elements like blockquote, code, etc. as needed
          },
        }}
      >
        {data.text}
      </Markdown>
    </div>
  );
};

export default Page;
