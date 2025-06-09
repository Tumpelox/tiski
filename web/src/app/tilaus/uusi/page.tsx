import OrderWithCode from '@/app/tilaus/uusi/OrderWithCode';
import { Heading } from '@/components/Text';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getOrderCode } from '@/services/orderCode';
import { getLoggedInUser } from '@/services/userSession';
import Order from './Order';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import { redirect } from 'next/navigation';

const UusiTilausPage = async () => {
  const { user } = await getLoggedInUser();
  const orderCode = await getOrderCode(user);

  const date = new Date(new Date().toUTCString());
  const closeDate = new Date('Mon, 09 Jun 2025 21:00:00 GMT');

  if (date >= closeDate) redirect('/tilaus');
  return (
    <ReCaptchaProvider>
      <Card>
        <CardHeader>
          <Heading.h1 className="text-2xl">Uusi tilaus</Heading.h1>
        </CardHeader>
        <CardContent>
          {orderCode && !orderCode.orders && <OrderWithCode />}
          {!orderCode && <Order />}
        </CardContent>
      </Card>
    </ReCaptchaProvider>
  );
};

export default UusiTilausPage;
