import { QRCode, QRCodeDatabase } from '@/interfaces/qr.interfaces';
import { getDocumentWithApi } from '@/services/databases';
import { SearchParams } from 'next/dist/server/request/search-params';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<SearchParams>;
}

const QRCodePage = async ({ searchParams }: PageProps) => {
  const { to } = await searchParams;

  if (to === undefined && typeof to !== 'string') {
    return redirect('/');
  }

  const { data } = await getDocumentWithApi<QRCode>(
    QRCodeDatabase.DatabaseId,
    QRCodeDatabase.CollectionId,
    to as string
  );

  if (data) {
    const searchParams = new URLSearchParams();
    if (data.destination.startsWith('/')) {
      searchParams.set('qr', to as string);
    }
    return redirect(data.destination + '?' + searchParams.toString());
  }

  return redirect('/');
};

export default QRCodePage;
