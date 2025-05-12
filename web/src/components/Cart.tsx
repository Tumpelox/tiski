'use client';

import { useCartStore } from '@/store';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Product } from '@/interfaces/product.interface';
import { Bundle } from '@/interfaces/bundle.interface';
import { CloudButton, CloudLink } from './CloudButton';
import { ItemCount } from './AddToCart';
import { X } from 'lucide-react';
import { Heading, Paragraph } from './Text';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalItems } =
    useCartStore();

  if (items.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Heading.h2>Ostoskori</Heading.h2>
          <Paragraph>Ostoskorisi on tyhjä</Paragraph>
        </CardHeader>
        <CardFooter>
          <CloudLink small href="/tuotteet" className="text-white">
            Selaa tuotteita
          </CloudLink>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <Heading.h2>Ostoskori</Heading.h2>
        <Paragraph>Ostoskorissasi on {getTotalItems()} tuotetta</Paragraph>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.$id}
              className="grid items-center grid-cols-10 grid-rows-2 sm:flex gap-4 border-b pb-4"
            >
              {item.type === 'product' &&
                (item.item as Product).pictures[0] && (
                  <div className="size-full  sm:size-24 aspect-square relative col-span-2">
                    <Image
                      src={(item.item as Product).pictures[0].src}
                      alt={(item.item as Product).pictures[0].alt}
                      fill
                      className="object-cover rounded "
                    />
                  </div>
                )}
              {item.type === 'bundle' && (item.item as Bundle).promoImage && (
                <div className="size-full sm:size-24 aspect-square relative col-span-2">
                  <Image
                    src={(item.item as Bundle).promoImage?.src as string}
                    alt={(item.item as Bundle).promoImage?.alt as string}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div className="col-span-8 flex-grow w-full">
                <Heading.h4>
                  <Link
                    href={`/tuotteet${item.type === 'bundle' ? '/paketit/' + item.$id : item.$id}`}
                  >
                    {item.item.title}
                  </Link>
                </Heading.h4>
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
                className="col-span-8 w-full justify-center sm:w-fit sm:flex-col-reverse"
              />{' '}
              <Button
                className="col-span-2"
                variant="ghost"
                onClick={() => removeItem(item.$id)}
              >
                <X className="size-6 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <CloudButton
          small
          onClick={clearCart}
          variant={'secondary'}
          className="text-white"
        >
          TYHJENNÄ
        </CloudButton>
        <CloudLink small href="/tilaus/uusi" className="text-white">
          TILAA
        </CloudLink>
      </CardFooter>
    </Card>
  );
};

export default Cart;
