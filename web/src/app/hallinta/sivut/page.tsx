import { Article, ArticleDatabase } from '@/interfaces/article.interface';
import { listDocuments } from '@/services/databases';
import { redirect } from 'next/navigation';

const SivutHallintaPage = async () => {
  const { data } = await listDocuments<Article>(
    ArticleDatabase.DatabaseId,
    ArticleDatabase.CollectionId
  );
  console.log(data);
  if (!data) redirect('/');

  return (
    <div className="container mx-auto">
      <h1>Listaus aktiivisista sivuista</h1>
      <ul className="list-disc pl-5">
        {data.map((item) => (
          <li key={item.$id}>
            <a href={`/hallinta/sivut/${item.$id}`}>{item.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SivutHallintaPage;
