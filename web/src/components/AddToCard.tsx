'use client';

import { Product } from '@/interfaces/product.interface';
import { Button } from './ui/button';
import { useCartStore } from '@/store';

const AddToCard = ({ product }: { product: Product }) => {
  const { addItem } = useCartStore();
  return (
    <Button
      disabled={!product.available && product.stock === 0}
      onClick={() => addItem(product)}
    >
      Lisää tilaukseen
    </Button>
  );
};

export default AddToCard;
