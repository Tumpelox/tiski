import { Heading } from '@/components/Text';
import { Card, CardContent } from '@/components/ui/card';
import {
  PictureDatabase,
  PictureDocument,
} from '@/interfaces/picture.interface';
import { listDocuments } from '@/services/databases';

import { redirect } from 'next/navigation';
import UploadImage from './UploadImage';

import ImageWithRemove from './ImageWithRemove';

const KuvatPage = async () => {
  const { data } = await listDocuments<PictureDocument>(
    PictureDatabase.DatabaseId,
    PictureDatabase.CollectionId
  );

  if (!data) redirect('/');

  return (
    <div className="space-y-4">
      <Heading.h1>Kuvat</Heading.h1>
      <Card>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.map((picture) => (
              <ImageWithRemove key={picture.$id} {...picture} />
            ))}
          </div>
          <UploadImage />
        </CardContent>
      </Card>
    </div>
  );
};

export default KuvatPage;
