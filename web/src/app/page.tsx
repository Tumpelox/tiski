// import MarkdownToHtml from '@/components/MarkdownToHtml';
// import getSettings from '@/lib/settings';

export default async function Home() {
  // const settings = await getSettings();

  return (
    <>
      <div className="grid grid-rows-2 grow min-h-[calc(100dvh-var(--spacing)*28)]">
        <div></div>
        <div className="flex flex-col items-center w-full text-white text-center row-span-1 py-8">
          <h1 className="font-bold text-shadow-[0_0_20px_#ffffff] text-shadow-white text-4xl md:text-5xl">
            TARRATOIMIKUNTA
          </h1>
          <p className="text-3xl md:text-4xl font-light">SUVISEUROISSA 2025</p>
        </div>
      </div>
      {/* <MarkdownToHtml markdown={settings?.frontpage.text || ''} /> */}
    </>
  );
}
