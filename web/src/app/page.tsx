// import MarkdownToHtml from '@/components/MarkdownToHtml';
// import getSettings from '@/lib/settings';

import { CloudButton, CloudLink } from '@/components/CloudButton';
import FeedbackForm from '@/components/FeedbackForm';
import ReCaptchaContext from '@/components/ReCaptchaContext';
import { Paragraph } from '@/components/Text';

export default async function Home() {
  // const settings = await getSettings();

  return (
    <>
      <div className="flex flex-col justify-center grow min-h-[calc(100dvh-var(--spacing)*28)] md:min-h-[calc(100dvh-var(--spacing)*40)]">
        <div className="flex flex-col items-center w-full text-white text-center row-span-1 py-8 gap-6 translate-y-1/4">
          <div className="flex flex-col">
            <h1 className="font-bold text-shadow-[0_0_20px_#ffffff] text-4xl md:text-5xl">
              TARRATOIMIKUNTA
            </h1>
            <p className="text-3xl md:text-4xl font-light text-shadow-[0_0_20px_#ffffff]">
              SUVISEUROISSA 2025
            </p>
          </div>
          <Paragraph className="text-center text-shadow-[0_0_20px_#ffffff] text-2xl font-light">
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
      </div>
      {/* <ReCaptchaContext>
        <FeedbackForm />
      </ReCaptchaContext> */}
      {/* <MarkdownToHtml markdown={settings?.frontpage.text || ''} /> */}
    </>
  );
}
