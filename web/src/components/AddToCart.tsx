'use client';

import { Product } from '@/interfaces/product.interface';
import { Button } from './ui/button';
import { ToastType, useCartStore, useToastMessageStore } from '@/store';
import { Bundle } from '@/interfaces/bundle.interface';
import { CanAddToCart } from '@/interfaces/orderCode.interface';

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

  if (
    canAddToCart === CanAddToCart.AlreadyOrdedered ||
    canAddToCart === CanAddToCart.CodeNotFound
  ) {
    return <p className="w-full">{canAddToCart}</p>;
  }

  if (product !== undefined) {
    if (product.available === false) return null;
    return (
      <Button
        disabled={product.stock === 0}
        onClick={() => {
          addItem(product, 'product');
          addMessage(`${product.title} lisätty ostoskoriin`, ToastType.SUCCESS);
        }}
      >
        Lisää tilaukseen
      </Button>
    );
  }
  if (bundle !== undefined) {
    if (bundle.available === false) return null;
    const stock = bundle.products
      .map((product) => product.stock)
      .sort((a, b) => a - b)[0];
    return (
      <Button
        disabled={bundle.products.length === 0 || stock === 0}
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
