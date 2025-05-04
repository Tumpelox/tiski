'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Assuming you have an Input component
import { Label } from '@/components/ui/label'; // Assuming you have a Label component
import { useCartStore, useToastMessageStore, ToastType } from '@/store';
import { useState, useEffect } from 'react';
import { newOrder } from '@/actions/order';
import { useRouter } from 'next/navigation'; // Import useRouter
import { z } from 'zod';
import { Textarea } from './ui/textarea';

// Define Zod schema for shipping details
const shippingSchema = z.object({
  shippingName: z.string().min(2, 'Nimi vaaditaan'),
  shippingAddress: z.string().min(5, 'Osoite vaaditaan'),
});

const Order = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalItems } =
    useCartStore();
  const addMessage = useToastMessageStore((state) => state.addMessage);

  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{
    shippingName?: string[];
    shippingAddress?: string[];
    notes?: string[];
  }>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure this component only renders client-side where localStorage is available
    setIsClient(true);
  }, []);

  const handleOrderSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({}); // Clear previous errors

    if (!isClient || items.length === 0) {
      addMessage('Ostoskori on tyhjä.', ToastType.INFO);
      return;
    }

    const validationResult = shippingSchema.safeParse({
      shippingName,
      shippingAddress,
      notes,
    });

    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
      addMessage('Tarkista toimitustiedot.', ToastType.ERROR);
      return;
    }

    const orderData = {
      products: items.map((item) => ({ $id: item.$id })), // Send only product IDs
      bundles: [], // Assuming no bundles for now
      shippingName: validationResult.data.shippingName,
      shippingAddress: validationResult.data.shippingAddress,
    };

    try {
      // The server action handles redirection on success
      const result = await newOrder(orderData as any); // Type assertion might be needed depending on exact types
      console.log(result);
      if (result?.message) {
        // If the server action returns a message (error or info)
        addMessage(result.message, result.type || ToastType.ERROR);
      } else {
        // Success case (handled by redirect in server action, but clear cart here)
        addMessage('Tilaus lähetetty onnistuneesti!', ToastType.SUCCESS);
        clearCart();
        // Redirect is handled by the server action, no need for router.push here
      }
    } catch (error) {
      console.error('Order submission failed:', error);
      addMessage(
        'Tilauksen lähettäminen epäonnistui. Yritä uudelleen.',
        ToastType.ERROR
      );
    }
  };

  // Render null or a loader on the server until the client hydrates
  if (!isClient) {
    return null; // Or a loading spinner
  }

  const totalItems = getTotalItems();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Tilaus</CardTitle>
        <CardDescription>
          Tarkista ostoskorisi sisältö ja syötä toimitustiedot.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleOrderSubmit}>
          <h3 className="text-lg font-semibold mb-4">Ostoskori</h3>
          {items.length > 0 ? (
            <Table className="mb-6">
              <TableHeader>
                <TableRow>
                  <TableHead>Tuote</TableHead>
                  <TableHead className="text-center">Määrä</TableHead>
                  <TableHead className="text-right">Toiminnot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.$id}>
                    <TableCell className="font-medium">
                      {item.item.title}
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateQuantity(item.$id, parseInt(e.target.value))
                        }
                        className="w-16 mx-auto text-center"
                        aria-label={`Määrä tuotteelle ${item.item.title}`}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(item.$id)}
                        aria-label={`Poista ${item.item.title} ostoskorista`}
                      >
                        Poista
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground mb-6">
              Ostoskorisi on tyhjä.
            </p>
          )}

          <h3 className="text-lg font-semibold mb-4">Toimitustiedot</h3>
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="shippingName">Nimi</Label>
              <Input
                id="shippingName"
                value={shippingName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setShippingName(e.target.value)
                }
                placeholder="Etunimi Sukunimi"
                required
                aria-invalid={!!errors.shippingName}
                aria-describedby={
                  errors.shippingName ? 'shippingName-error' : undefined
                }
              />
              {errors.shippingName && (
                <p
                  id="shippingName-error"
                  className="text-sm text-red-600 mt-1"
                >
                  {errors.shippingName.join(', ')}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="shippingAddress">Osoite</Label>
              <Input
                id="shippingAddress"
                value={shippingAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setShippingAddress(e.target.value)
                }
                placeholder="Katuosoite, Postinumero Postitoimipaikka"
                required
                aria-invalid={!!errors.shippingAddress}
                aria-describedby={
                  errors.shippingAddress ? 'shippingAddress-error' : undefined
                }
              />
              {errors.shippingAddress && (
                <p
                  id="shippingAddress-error"
                  className="text-sm text-red-600 mt-1"
                >
                  {errors.shippingAddress.join(', ')}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="notes">Lisätiedot</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNotes(e.target.value)
                }
                placeholder="Tilauksen lisätiedot..."
                required
                aria-invalid={!!errors.notes}
                aria-describedby={errors.notes ? 'notes-error' : undefined}
              />
              {errors.notes && (
                <p id="notes-error" className="text-sm text-red-600 mt-1">
                  {errors.notes.join(', ')}
                </p>
              )}
            </div>
          </div>

          <CardFooter className="flex justify-end p-0 pt-6">
            <Button type="submit" disabled={totalItems === 0}>
              Lähetä tilaus ({totalItems} tuotetta)
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default Order;
