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
} from './ui/card';
import { Product } from '@/interfaces/product.interface';
import { Bundle } from '@/interfaces/bundle.interface';
import CloudButton from './CloudButton';
import { ItemCount } from './AddToCart';
import { X } from 'lucide-react';
import Title from './Title';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalItems } =
    useCartStore();

  if (items.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Title.h2>Ostoskori</Title.h2>
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
        <Title.h2>Ostoskori</Title.h2>
        <CardDescription>
          Ostoskorissasi on {getTotalItems()} tuotetta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.$id}
              className="flex items-center flex-wrap gap-4 border-b pb-4"
            >
              {item.type === 'product' &&
                (item.item as Product).pictures[0] && (
                  <div className="w-16 h-16 relative">
                    <Image
                      src={(item.item as Product).pictures[0].src}
                      alt={(item.item as Product).pictures[0].alt}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
              {item.type === 'bundle' && (item.item as Bundle).promoImage && (
                <div className="w-16 h-16 relative grid grid-cols-2 gap-2">
                  <Image
                    src={(item.item as Bundle).promoImage?.src as string}
                    alt={(item.item as Bundle).promoImage?.alt as string}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}

              <div className="flex-grow">
                <Title.h4>
                  <Link
                    href={`/tuotteet${item.type === 'bundle' ? '/paketit/' + item.$id : item.$id}`}
                  >
                    {item.item.title}
                  </Link>
                </Title.h4>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {item.item.description}
                </p>
              </div>
              <ItemCount
                count={item.quantity}
                handleChange={(value: number) =>
                  updateQuantity(item.$id, value)
                }
                stock={999}
              />
              <Button variant="ghost" onClick={() => removeItem(item.$id)}>
                <X className="size-6 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <CloudButton
          small
          button={{ onClick: clearCart }}
          backgroundColor="var(--foreground)"
          className="text-white"
        >
          TYHJENNÄ
        </CloudButton>
        <CloudButton
          small
          link={{ href: '/tilaus/uusi' }}
          backgroundColor="var(--violetti)"
          className="text-white"
        >
          TILAA
        </CloudButton>
      </CardFooter>
    </Card>
  );
};

export default Cart;
