'use server';

import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import { Heading, Paragraph } from './Text';
import Link from 'next/link';

const MarkdownToHtml = ({ markdown }: { markdown: string }) => {
  return (
    <Markdown
      options={{
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
      {markdown}
    </Markdown>
  );
};

export default MarkdownToHtml;
