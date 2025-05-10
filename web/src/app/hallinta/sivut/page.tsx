import { Article, ArticleDatabase } from '@/interfaces/article.interface';
import { listDocuments } from '@/services/databases';
import { redirect } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SivutHallintaPage = async () => {
  // Fetch articles
  const { data } = await listDocuments<Article>(
    ArticleDatabase.DatabaseId,
    ArticleDatabase.CollectionId
  );

  // Redirect if no data
  if (!data) redirect('/');

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sivut</h1>
        <Button asChild>
          <Link href="/hallinta/sivut/uusi">Luo uusi sivu</Link>
        </Button>
      </div>
      <Table>
        <TableCaption>Listaus kaikista sivuista.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Otsikko</TableHead>
            <TableHead>Luotu</TableHead>
            <TableHead>Muokattu</TableHead>
            <TableHead className="text-right">Toiminnot</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: Article) => (
            <TableRow key={item.$id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>
                {new Date(item.$createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(item.$updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/hallinta/sivut/${item.slug || item.$id}`}>
                    Muokkaa
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SivutHallintaPage;
