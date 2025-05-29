import OrderWithCode from '@/app/tilaus/uusi/OrderWithCode';
import { Heading } from '@/components/Text';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getOrderCode } from '@/services/orderCode';
import { getLoggedInUser } from '@/services/userSession';
import Order from './Order';
import { ReCaptchaProvider } from 'next-recaptcha-v3';

const UusiTilausPage = async () => {
  const { user } = await getLoggedInUser();
  const orderCode = await getOrderCode(user);

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
