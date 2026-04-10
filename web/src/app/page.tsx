import { CloudLink } from '@/components/CloudButton';
import { Paragraph } from '@/components/Text';
import InstagramFeed from '../components/InstagramFeed';

export default async function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen flex flex-col items-center justify-center md:min-h-[calc(100dvh-var(--spacing)*46)]">
        <div className="flex flex-col items-center w-full text-background text-center row-span-1 py-8 gap-6 m-50">
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
          <InstagramFeed/>
        </div>
      </div>
      {/* <ReCaptchaContext>
        <FeedbackForm />
      </ReCaptchaContext> */}
      {/* <MarkdownToHtml markdown={settings?.frontpage.text || ''} /> */}
    </>
  );
}
