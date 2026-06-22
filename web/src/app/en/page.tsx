import { Paragraph } from '@/components/Text';
import InstagramFeed from '../../components/InstagramFeed';
import Siluet from '@/components/Siluet';
import defaultMetadata from './../metadata';
import { Metadata } from 'next';
import LanguageSwitch from '@/components/LanguageSwitch';

export const metadata: Metadata = defaultMetadata;

export default async function Home() {
  return (
    <>
      <LanguageSwitch href="/en">EN</LanguageSwitch>
      <Siluet>
        <div className="flex flex-col gap-6 items-center py-8 row-span-1 text-foreground w-full md:translate-y-[-20%]">
          <div className="flex flex-col text-center w-full px-4">
            <h1 className="font-bold text-4xl md:text-5xl uppercase">
              Tarratoimikunta
            </h1>
            <h2 className="text-3xl md:text-4xl font-light uppercase">
              Summer services 2026
            </h2>
          </div>
          <Paragraph className="font-light text-center text-xl w-full px-8">
            Welcome to your safe haven. We are “Tarratoimikunta” - the sticker committee. Just like Jesus, we stand up for human rights and those who are vulnerable.
          </Paragraph>
          {/* <CloudLink
            className="mt-4 md:mt-8"
            variant={'card'}
            size={'large'}
            href="/sivut/mista-on-kyse"
          >
            MISTÄ ON KYSE?
          </CloudLink> */}
        </div>
      </Siluet>
      <div className="py-8 relative">
        <div className="container max-w-5xl mx-auto px-4 sm:px-8 md:px-8 lg:px-0">
          <h2 className="text-3xl md:text-4xl text-foreground mt-4 mb-8 text-center">
            Instagram posts from Tarratoimikunta
          </h2>
          <InstagramFeed />
        </div>
      </div>

      {/* <ReCaptchaContext>
        <FeedbackForm />
      </ReCaptchaContext> */}
      {/* <MarkdownToHtml markdown={settings?.frontpage.text || ''} /> */}
    </>
  );
}
