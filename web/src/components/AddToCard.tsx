'use client';

import { Product } from '@/interfaces/product.interface';
import { Button } from './ui/button';
import { ToastType, useCartStore, useToastMessageStore } from '@/store';
import { Bundle } from '@/interfaces/bundle.interface';

const AddToCard = ({
  product,
  bundle,
}: {
  product?: Product;
  bundle?: Bundle;
}) => {
  const { addItem } = useCartStore();
  const { addMessage } = useToastMessageStore();
  if (product !== undefined)
    return (
      <Button
        disabled={!product.available || product.stock === 0}
        onClick={() => {
          console.log('product', product);
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
};

export default AddToCard;
