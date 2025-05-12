'use client';

import { Product } from '@/interfaces/product.interface';
import { Button } from './ui/button';
import { ToastType, useCartStore, useToastMessageStore } from '@/store';
import { Bundle } from '@/interfaces/bundle.interface';
import { CanAddToCart } from '@/interfaces/orderCode.interface';
import { useState } from 'react';
import { Input } from './ui/input';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ItemCount = ({
  count,
  stock,
  handleChange,
  className,
}: {
  count: number;
  stock: number;
  handleChange: (value: number) => void;
  className?: string;
}) => {
  const [value, setValue] = useState(String(count));
  const handleItemCountChange = (value: number | string) => {
    if (!isNaN(Number(value)) && Number(value) > 0) {
      setValue(String(value));
      handleChange(Number(value));
    } else {
      handleChange(1);
    }
  };
  return (
    <div
      className={cn(className, 'flex items-center justify-between gap-2 w-fit')}
    >
      <Button
        disabled={stock === 0}
        variant={'ghost'}
        onClick={() => handleItemCountChange(count - 1 > 0 ? count - 1 : 1)}
      >
        <Minus className="size-4" />
      </Button>

      <Input
        name="item-count"
        pattern="[0-9]]{2}"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => handleItemCountChange(e.target.value)}
        className="text-center w-[6ch] py-5 rounded-2xl px-0 bg-background text-foreground "
      />

      <Button
        disabled={stock === 0}
        variant={'ghost'}
        onClick={() =>
          handleItemCountChange(count + 1 > stock ? count : count + 1)
        }
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
};

const AddToCart = ({
  product,
  bundle,
  canAddToCart = CanAddToCart.CodeNotFound,
}: {
  product?: Product;
  bundle?: Bundle;
  canAddToCart: CanAddToCart;
}) => {
  const { addItem } = useCartStore();
  const { addMessage } = useToastMessageStore();

  const [count, setCount] = useState(1);

  const handleItemCountChange = (value: number | string) => {
    if (!isNaN(Number(value)) && Number(value) > 0) {
      setCount(Number(value));
    } else {
      setCount(1);
    }
  };

  if (
    canAddToCart === CanAddToCart.AlreadyOrdedered ||
    canAddToCart === CanAddToCart.CodeNotFound
  ) {
    return (
      <p className="text-center text-sm text-foreground">{canAddToCart}</p>
    );
  }

  if (product !== undefined) {
    if (product.available === false) return null;
    return (
      <div className="flex flex-col gap-4 w-full items-center">
        <ItemCount
          stock={product.stock}
          count={count}
          handleChange={handleItemCountChange}
        />
        <Button
          variant={'ghost'}
          disabled={product.stock === 0}
          onClick={() => {
            addItem(product, 'product');
            addMessage(
              `${product.title} x ${count} lisätty ostoskoriin`,
              ToastType.SUCCESS
            );
          }}
          className="w-full font-light text-lg"
        >
          LISÄÄ OSTOSKORIIN
        </Button>
      </div>
    );
  }
  if (bundle !== undefined) {
    if (bundle.available === false) return null;
    const stock = bundle.products
      .map((product) => product.stock)
      .sort((a, b) => a - b)[0];
    return (
      <div className="flex flex-col gap-4 w-full items-center">
        <ItemCount
          stock={stock}
          handleChange={handleItemCountChange}
          count={count}
        />
        <Button
          variant={'ghost'}
          disabled={bundle.products.length === 0 || stock === 0}
          onClick={() => {
            addItem(bundle, 'bundle', count);
            addMessage(
              `${bundle.title} x ${count} lisätty ostoskoriin`,
              ToastType.SUCCESS
            );
          }}
          className="w-full font-light text-lg"
        >
          LISÄÄ OSTOSKORIIN
        </Button>
      </div>
    );
  }

  return null;
};

export default AddToCart;
