import { CloudLink } from '@/components/CloudButton';
import { Paragraph } from '@/components/Text';
import InstagramFeed from '../components/InstagramFeed';
import Siluet from '@/components/Siluet';

export default async function Home() {
  return (
    <>
      <div className="flex flex-col justify-center grow min-h-[calc(100svh-var(--spacing)*16)] md:min-h-[calc(100svh-var(--spacing)*28)]">
        <div className="flex flex-col gap-6 items-center py-8 row-span-1 text-foreground text-shadow-[0_0_20px_var(--foreground)] w-full">
          <div className="flex flex-col text-center w-full">
            <h1 className="font-bold text-4xl md:text-5xl">TARRATOIMIKUNTA</h1>
            <p className="text-3xl md:text-4xl font-light">
              SUVISEUROISSA 2026
            </p>
          </div>
          <Paragraph className="font-light text-center text-xl w-full px-8">
            Tervetuloa turvasatamaan. Me olemme Tarratoimikunta. Seisomme
            ihmisoikeuksien ja heikompien puolella Jeesuksen tavoin.
          </Paragraph>
          <CloudLink
            className="mt-4 md:mt-8"
            variant={'card'}
            size={'large'}
            href="/sivut/mista-on-kyse"
          >
            MISTÄ ON KYSE?
          </CloudLink>
        </div>
        <Siluet />
      </div>
      <div className="bg-primary py-8 relative">
        <div className="absolute h-36 -top-1 left-0 w-full gradient-from-background-to-transparent"></div>
        <div className="container max-w-5xl mx-auto px-4 sm:px-8 md:px-8 lg:px-0">
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
