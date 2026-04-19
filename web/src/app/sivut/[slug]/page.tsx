import Siluet from '@/components/Siluet';
import { Heading, Paragraph } from '@/components/Text';
import { Article, ArticleDatabase } from '@/interfaces/article.interface';
import { getDocumentWithApi } from '@/services/databases';
import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

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
    <div className="grow bg-primary text-primary-foreground">
      <Siluet height="half" variant="secondary">
        <Heading.h1 className="mt-6 mb-4 text-4xl text-wrap">
          {data.title.toUpperCase()}
        </Heading.h1>
      </Siluet>
      <div className="flex flex-col gap-4 container max-w-5xl mx-auto pb-8 pt-4 px-4 sm:px-8 md:px-8 lg:px-0 text-lg">
        <Markdown
          options={{
            wrapper: React.Fragment,
            overrides: {
              h1: {
                component: Heading.h1,
              },
              h2: {
                component: Heading.h2,
              },
              h3: {
                component: Heading.h3,
              },
              h4: {
                component: Heading.h4,
              },
              h5: {
                component: Heading.h5,
              },
              h6: {
                component: Heading.h6,
              },
              p: {
                component: Paragraph,
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
                component: Link,
              },
              img: {
                component: Image,
                props: {
                  className: '',
                },
              },
            },
          }}
        >
          {data.text}
        </Markdown>
      </div>
    </div>
  );
};

export default Page;
