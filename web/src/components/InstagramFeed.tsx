import { Query } from 'node-appwrite';
import { listDocumentsWithApi } from '@/services/databases';
import { FeedDocument, FeedDatabase } from '@/interfaces/feed.interface';
import ImageGallery from '@/components/ImageGallery';
import MarkdownToHtml from './MarkdownToHtml';
import InstagramPost from './InstagramPost';

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
      <h2 className="text-3xl md:text-4xl text-foreground text-shadow-[0_0_20px_var(--foreground)] mt-40 mb-8 text-center">
        Tarratoimikunnan Instagram-julkaisuja
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 justify-items-center">
        {posts.toReversed().map((post) => (
          <InstagramPost key={post.$id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default InstagramFeed;
