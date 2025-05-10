'use client';

import { Product } from '@/interfaces/product.interface';
import { Button } from './ui/button';
import { ToastType, useCartStore, useToastMessageStore } from '@/store';
import { Bundle } from '@/interfaces/bundle.interface';

const AddToCart = ({
  product,
  bundle,
  canAddToCart = true,
}: {
  product?: Product;
  bundle?: Bundle;
  canAddToCart?: boolean;
}) => {
  const { addItem } = useCartStore();
  const { addMessage } = useToastMessageStore();

  if (!canAddToCart) {
    return (
      <Button
        disabled
        className="w-full max-w-xs text-center whitespace-normal break-words"
      >
        Tilauskoodia on jo käytetty
      </Button>
    );
  }

  if (product !== undefined)
    return (
      <Button
        disabled={!product.available || product.stock === 0}
        onClick={() => {
          addItem(product, 'product');
          addMessage(`${product.title} lisätty ostoskoriin`, ToastType.SUCCESS);
        }}
      >
        Lisää tilaukseen
      </Button>
    );

  if (bundle !== undefined) {
    const stock = bundle.products
      .map((product) => product.stock)
      .sort((a, b) => a - b)[0];
    return (
      <Button
        disabled={
          !bundle.available || bundle.products.length === 0 || stock === 0
        }
        onClick={() => {
          addItem(bundle, 'bundle');
          addMessage(`${bundle.title} lisätty ostoskoriin`, ToastType.SUCCESS);
        }}
      >
        Lisää tilaukseen
      </Button>
    );
  }

  return null;
};

export default AddToCart;
