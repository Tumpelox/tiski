import { CloudLink } from '@/components/CloudButton';
import { Paragraph } from '@/components/Text';
import InstagramFeed from '../components/InstagramFeed';
import Siluet from '@/components/Siluet';

export default async function Home() {
  return (
    <>
      <div className="flex flex-col justify-center grow min-h-[calc(100vh-var(--spacing)*28)] md:min-h-[calc(100vh-var(--spacing)*46)] md:min-h-[calc(100vh-var(--spacing)*46)] md:mb-40 lg:mb-[calc(var(--spacing)*104)] xl:mb-[calc(var(--spacing)*120)]">
        <div className="flex flex-col items-center w-full text-foreground text-center row-span-1 py-8 gap-6 translate-y-1/12">
          <div className="flex flex-col">
            <h1 className="font-bold text-shadow-[0_0_20px_#ffffff] text-4xl md:text-5xl">
              TARRATOIMIKUNTA
            </h1>
            <p className="text-3xl md:text-4xl font-light text-shadow-[0_0_20px_#ffffff]">
              SUVISEUROISSA 2026
            </p>
          </div>
          <Paragraph className="text-center text-shadow-[0_0_20px_#ffffff] text-xl font-light">
            Tervetuloa turvasatamaan. Me olemme Tarratoimikunta. Seisomme
            ihmisoikeuksien ja heikompien puolella Jeesuksen tavoin.{' '}
          </Paragraph>
          <CloudLink
            className="mt-10"
            variant={'card'}
            size={'large'}
            href="/sivut/mista-on-kyse"
          >
            MISTÄ ON KYSE?
          </CloudLink>
        </div>
        <Siluet />
      </div>
      <div className="bg-primary pt-8 relative">
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
