import Order from '@/app/tilaus/uusi/Order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOrderCode } from '@/services/orderCode';
import { getLoggedInUser } from '@/services/userSession';
import { redirect } from 'next/navigation';

const UusiTilausPage = async () => {
  const user = await getLoggedInUser();
  const orderCode = await getOrderCode(user);

  if (!orderCode) redirect('/tilaus');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uusi tilaus</CardTitle>
      </CardHeader>
      <CardContent>
        <Order />
      </CardContent>
    </Card>
  );
};

export default UusiTilausPage;
