'use client';

import { useCartStore } from '@/store';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Product } from '@/interfaces/product.interface';
import { BundleImages } from './BundleCard';
import { Bundle } from '@/interfaces/bundle.interface';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalItems } =
    useCartStore();

  if (items.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ostoskori</CardTitle>
          <CardDescription>Ostoskorisi on tyhjä</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/tuotteet">
            <Button>Selaa tuotteita</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ostoskori</CardTitle>
        <CardDescription>
          Ostoskorissasi on {getTotalItems()} tuotetta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.$id}
              className="flex items-center gap-4 border-b pb-4"
            >
              {item.type === 'product' &&
                (item.item as Product).pictures[0] && (
                  <div className="w-16 h-16 relative">
                    <Image
                      src={(item.item as Product).pictures[0].url}
                      alt={(item.item as Product).pictures[0].alt}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
              {item.type === 'bundle' && (
                <div className="w-16 h-16 relative grid grid-cols-2 gap-2">
                  <BundleImages products={(item.item as Bundle).products} />
                </div>
              )}
              <div className="flex-grow">
                <h3 className="font-medium">
                  <Link
                    href={`/tuotteet${item.type === 'bundle' ? '/paketit/' + item.$id : item.$id}`}
                  >
                    {item.item.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {item.item.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateQuantity(item.$id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateQuantity(item.$id, item.quantity + 1)}
                  disabled={
                    item.quantity >=
                    (item.type === 'product'
                      ? (item.item as Product).stock
                      : 100)
                  }
                >
                  +
                </Button>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-red-500"
                onClick={() => removeItem(item.$id)}
              >
                Poista
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={clearCart}>
          Tyhjennä kori
        </Button>
        <Link href="/tilaus/uusi">
          <Button>Siirry kassalle</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Cart;
