'use client'; // Important: This needs to be a Client Component

import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/store'; //
import { fetchProducts } from '@/actions/product';
import { Product } from '@/interfaces/product.interface'; //

// Geminin settiä mut vois olla järkevämpää vaa käyttää tRPC:tä tuotteiden hakuun. Server actionit ei oo tarkotettu varsinaisesti tähän

// Interface to hold availability status along with cart item
interface CartItemWithAvailability extends Product {
  quantity: number;
  isAvailable?: boolean; // Optional: true if available, false if not, undefined if not checked yet
  availableStock?: number; // Optional: the current stock level
}

export function CartReview() {
  const cartItems = useCartStore((state) => state.items); //
  const [itemsWithAvailability, setItemsWithAvailability] =
    useState<CartItemWithAvailability[]>(cartItems);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAvailability = async () => {
      if (cartItems.length === 0) {
        setItemsWithAvailability([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      const productIds = cartItems.map((item) => item.$id); //

      try {
        const availabilityData = await fetchProducts(productIds);

        // Merge availability data with cart items
        const updatedItems = cartItems.map((cartItem) => {
          const availability = availabilityData.find(
            (avail) => avail.$id === cartItem.$id
          );
          return {
            ...cartItem,
            isAvailable: availability ? availability.available : false, // Assume unavailable if not found in results
            availableStock: availability ? availability.stock : 0, // Assume 0 stock if not found
          };
        });
        setItemsWithAvailability(updatedItems);
      } catch (err) {
        console.error('Failed to check availability:', err);
        setError('Could not update product availability. Please try again.');
        // Keep existing items but maybe flag them as unchecked
        setItemsWithAvailability(
          cartItems.map((item) => ({
            ...item,
            isAvailable: undefined,
            availableStock: undefined,
          }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkAvailability();
  }, [cartItems]); // Re-run when cart items change

  // --- Render Logic ---
  // Use itemsWithAvailability to render the cart.
  // Disable checkout button if isLoading, error exists, or any item.isAvailable === false
  // Show messages based on item.isAvailable and item.availableStock (e.g., "Out of stock", "Low stock")

  const canProceed =
    !isLoading &&
    !error &&
    itemsWithAvailability.every(
      (item) => item.isAvailable && item.quantity <= (item.availableStock ?? 0)
    );

  return (
    <div>
      <h2>Review Your Cart</h2>
      {isLoading && <p>Checking product availability...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {itemsWithAvailability.map((item) => (
          <li
            key={item.$id}
            style={{ opacity: item.isAvailable === false ? 0.5 : 1 }}
          >
            {item.title} - Quantity: {item.quantity} {/* */}
            {item.isAvailable === false && (
              <span style={{ color: 'red', marginLeft: '10px' }}>
                {' '}
                (Out of Stock)
              </span>
            )}
            {item.isAvailable === true &&
              item.availableStock !== undefined &&
              item.availableStock < item.quantity && (
                <span style={{ color: 'orange', marginLeft: '10px' }}>
                  {' '}
                  (Insufficient Stock: {item.availableStock} available)
                </span>
              )}
            {item.isAvailable === true &&
              item.availableStock !== undefined &&
              item.availableStock < 5 &&
              item.availableStock >= item.quantity && (
                <span style={{ color: 'orange', marginLeft: '10px' }}>
                  {' '}
                  (Low Stock!)
                </span>
              )}
            {item.isAvailable === undefined && !isLoading && !error && (
              <span style={{ color: 'grey', marginLeft: '10px' }}>
                {' '}
                (Availability unknown)
              </span>
            )}
          </li>
        ))}
      </ul>
      <button disabled={!canProceed || itemsWithAvailability.length === 0}>
        {isLoading ? 'Checking...' : 'Proceed to Checkout'}
      </button>
      {!canProceed && !isLoading && itemsWithAvailability.length > 0 && (
        <p style={{ color: 'red', marginTop: '10px' }}>
          Cannot proceed: Some items are unavailable or have insufficient stock.
        </p>
      )}
    </div>
  );
}
