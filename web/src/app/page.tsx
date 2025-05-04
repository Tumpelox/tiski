import MarkdownToHtml from '@/components/MarkdownToHtml';
import getSettings from '@/lib/settings';

export default async function Home() {
  const settings = await getSettings();

  return (
    <div>
      <MarkdownToHtml markdown={settings?.frontpage.text ?? ''} />
    </div>
  );
}
