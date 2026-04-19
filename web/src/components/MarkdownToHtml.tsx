import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import { Heading, Paragraph } from './Text';
import Link from 'next/link';
import React from 'react';

const MarkdownToHtml = ({ markdown }: { markdown: string }) => {
  return (
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
            props: {
              className: 'text-sm mb-2 mt-1',
            },
          },
          ul: {
            component: 'ul',
            props: {
              className: 'list-disc list-inside mb-2 mt-1', // Example Tailwind classes for ul
            },
          },
          ol: {
            component: 'ul',
            props: {
              className: 'list-decimal list-inside mb-2 mt-1', // Example Tailwind classes for ul
            },
          },
          li: {
            component: 'li',
            props: {
              className: 'mb-1',
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
