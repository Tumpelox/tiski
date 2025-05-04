import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/interfaces/product.interface'; // Assuming you have this interface
import { produce } from 'immer';
import { Bundle } from './interfaces/bundle.interface';

//Geminin generoimaa koodia. Vaikutti ihan fiksulta mut lisäsin immerin

interface CartItem {
  $id: string;
  item: Product | Bundle;
  type: 'product' | 'bundle';
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (
    newItem: Product | Bundle,
    type: 'product' | 'bundle',
    quantity?: number
  ) => void;
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
      addItem: (newItem, type, quantity = 1) =>
        set(
          produce((draft: CartState) => {
            const existingItem = draft.items.find(
              (item) => newItem.$id === item.$id
            );
            if (existingItem) {
              existingItem.quantity += quantity;
            } else {
              draft.items.push({
                item: newItem,
                type,
                $id: newItem.$id,
                quantity,
              });
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

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}
interface Message {
  uuid: string;
  text: string;
  type: ToastType;
}

interface ToastMessageStore {
  messages: Message[];
  addMessage: (message: string, type: ToastType) => void;
  removeMessage: (uuid: string) => void;
  clearMessages: () => void;
}

export const useToastMessageStore = create<ToastMessageStore>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message, type) =>
        set(
          produce((draft: ToastMessageStore) => {
            draft.messages.push({
              uuid: crypto.randomUUID(),
              text: message,
              type: type,
            });
          })
        ),
      removeMessage: (uuid: string) =>
        set(
          produce((draft: ToastMessageStore) => {
            draft.messages = draft.messages.filter((m) => m.uuid !== uuid);
          })
        ),
      clearMessages: () =>
        set(
          produce((draft: ToastMessageStore) => {
            draft.messages = [];
          })
        ),
    }),
    {
      name: 'toast-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
