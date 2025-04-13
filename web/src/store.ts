import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/interfaces/product.interface'; // Assuming you have this interface
import { produce } from 'immer';

//Geminin generoimaa koodia. Vaikutti ihan fiksulta mut lisäsin immerin

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  // Add other necessary state/actions like calculating total price, etc.
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set(
          produce((draft: CartState) => {
            const existingItem = draft.items.find(
              (item) => item.$id === product.$id
            );
            if (existingItem) {
              existingItem.quantity += quantity;
            } else {
              draft.items.push({ ...product, quantity });
            }
          })
        ),
      removeItem: (productId) =>
        set(
          produce((draft: CartState) => {
            draft.items = draft.items.filter((item) => item.$id !== productId);
          })
        ),
      updateQuantity: (productId, quantity) =>
        set(
          produce((draft: CartState) => {
            draft.items = draft.items
              .map((item) => {
                if (item.$id === productId) {
                  item.quantity = Math.max(0, quantity);
                }
                return item;
              })
              .filter((item) => item.quantity > 0);
          })
        ),
      clearCart: () =>
        set(
          produce((draft: CartState) => {
            draft.items = [];
          })
        ),
      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
