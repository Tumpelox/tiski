'use client';

import { Product } from '@/interfaces/product.interface';
import { Button } from './ui/button';
import { ToastType, useCartStore, useToastMessageStore } from '@/store';

const AddToCard = ({ product }: { product: Product }) => {
  const { addItem } = useCartStore();
  const { addMessage } = useToastMessageStore();
  return (
    <Button
      disabled={!product.available && product.stock === 0}
      onClick={() => {
        addItem(product);
        addMessage(`${product.title} lisätty ostoskoriin`, ToastType.SUCCESS);
      }}
    >
      Lisää tilaukseen
    </Button>
  );
};

export default AddToCard;
