import Order from '@/app/tilaus/uusi/Order';
import { Heading } from '@/components/Text';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getOrderCode } from '@/services/orderCode';
import { getLoggedInUser } from '@/services/userSession';
import { redirect } from 'next/navigation';

const UusiTilausPage = async () => {
  const { user } = await getLoggedInUser();
  const orderCode = await getOrderCode(user);

  if (!orderCode) redirect('/tilaus');

  return (
    <Card>
      <CardHeader>
        <Heading.h1 className="text-2xl">Uusi tilaus</Heading.h1>
      </CardHeader>
      <CardContent>
        <Order />
      </CardContent>
    </Card>
  );
};

export default UusiTilausPage;
