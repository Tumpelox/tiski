import { Query } from 'node-appwrite';
import { listDocumentsWithApi } from '@/services/databases';
import {
  FeedDocument,
  FeedDatabase,
} from '@/interfaces/feed.interface';
import ImageGallery from '@/components/ImageGallery';
import MarkdownToHtml from './MarkdownToHtml';


const getPosts = async (): Promise<FeedDocument[]> => {
  const { data } = await listDocumentsWithApi<FeedDocument>(
    FeedDatabase.DatabaseId,
    FeedDatabase.CollectionId,
    [
      Query.select([
        '$id',
        'text',
        'images.src',
        'images.alt',
        'images.width',
        'images.height',
      ]),
    ]
  );

  return data ?? [];
};



const InstagramFeed = async () => {
  const posts = await getPosts();

  return (
    <div className="space-y-6">
      <h2 className="text-shadow-[0_0_20px_#ffffff] text-4xl md:text-5xl mt-30">
        Tarratoimikunnan Instagram-julkaisuja
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 justify-items-center">
        {posts.map((post) => (
          <div
            key={post.$id}
            className="space-y-2"
          >
            <ImageGallery images={post.images} />
            <div className='bg-white text-black text-left p-1 md: max-w-md'>
              <MarkdownToHtml markdown={post.text} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramFeed
