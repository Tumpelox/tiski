'use client';

import { useCartStore } from '@/store';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Product } from '@/interfaces/product.interface';
import { Bundle } from '@/interfaces/bundle.interface';
import { ItemCount } from './AddToCart';
import { ShoppingBasket, X } from 'lucide-react';
import { Heading, Paragraph } from './Text';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const CartMenu = () => {
  const { items, getTotalItems } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  const pathName = usePathname();

  useEffect(() => {
    if (items.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [items]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathName]);

  if (getTotalItems() === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button className="h-fit m-1 p-2 border-0 relative" variant={'ghost'}>
          <ShoppingBasket className="size-10" />
          <span className="absolute bottom-1 right-1 size-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
            {getTotalItems()}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Cart />
      </DialogContent>
    </Dialog>
  );
};

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
          <Link href="/tuotteet">Selaa tuotteita</Link>
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
              />
              <Button
                className="col-span-2"
                variant="ghost"
                onClick={() => removeItem(item.$id)}
                title="Poista tuote ostoskorista"
              >
                <X className="size-6 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={clearCart} variant={'ghost'}>
          TYHJENNÄ
        </Button>
        <Link href="/tilaus/uusi">TILAA</Link>
      </CardFooter>
    </Card>
  );
};

export default Cart;
