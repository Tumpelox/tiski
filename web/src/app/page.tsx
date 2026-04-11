import { CloudLink } from '@/components/CloudButton';
import { Paragraph } from '@/components/Text';
import InstagramFeed from '../components/InstagramFeed';
import Siluet from '@/components/Siluet';

export default async function Home() {
  return (
    <>
      <div className="flex flex-col justify-center grow min-h-[calc(100vh-var(--spacing)*20)] md:min-h-[calc(100vh-var(--spacing)*32)]">
        <div className="flex flex-col gap-6 items-center py-8 row-span-1 text-foreground text-primary-foreground text-shadow-[0_0_20px_#ffffff] translate-y-[4.3%] w-full">
          <div className="flex flex-col text-center w-full">
            <h1 className="font-bold text-shadow-[0_0_20px_#ffffff] text-4xl md:text-5xl">
              TARRATOIMIKUNTA
            </h1>
            <p className="text-3xl md:text-4xl font-light text-shadow-[0_0_20px_#ffffff]">
              SUVISEUROISSA 2026
            </p>
          </div>
          <Paragraph className="font-light text-center text-shadow-[0_0_20px_#ffffff] text-xl w-full">
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
        <div className="absolute h-36 top-0 left-0 w-full gradient-from-background-to-transparent"></div>
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
