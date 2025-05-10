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
import { useState, useEffect, useActionState } from 'react';
import { newOrder } from '@/actions/order';
import { redirect } from 'next/navigation'; // Import useRouter
import { z } from 'zod';
import { Textarea } from '../../../components/ui/textarea';
import LoginWithCode from '@/components/LoginWithCode';

// Define Zod schema for shipping details
const shippingSchema = z.object({
  shippingName: z.string().min(2, 'Nimi vaaditaan'),
  shippingAddress: z.string().min(5, 'Osoite vaaditaan'),
});

const Order = () => {
  const [message, formAction] = useActionState(newOrder, null);

  const { items, removeItem, updateQuantity, getTotalItems } = useCartStore();
  const addMessage = useToastMessageStore((state) => state.addMessage);
  const [errors, setErrors] = useState<{
    shippingName?: string[];
    shippingAddress?: string[];
    notes?: string[];
  }>({});

  useEffect(() => {
    if (message) {
      addMessage(message.message, message.type);
      if (message.type === ToastType.SUCCESS) {
        // Redirect to the order confirmation page
        redirect(`/tilaus/${message.data}`);
      } else if (message.type === ToastType.ERROR) {
        // Handle error messages
        const parsedErrors = message.data
          ? shippingSchema.safeParse(message.data)
          : null;

        if (parsedErrors && !parsedErrors.success) {
          const errorMessages: { [key: string]: string[] } = {};
          parsedErrors.error.errors.forEach((error) => {
            const field = error.path[0];
            if (!errorMessages[field]) {
              errorMessages[field] = [];
            }
            errorMessages[field].push(error.message);
          });
          setErrors(errorMessages);
        } else {
          setErrors({
            shippingName: ['Virheellinen nimi'],
            shippingAddress: ['Virheellinen osoite'],
            notes: ['Virheellinen lisätieto'],
          });
        }
      } else {
        // Clear errors if the message is not an error
        setErrors({});
      }
    }
  }, [message, addMessage]);

  const totalItems = getTotalItems();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Tilaus</CardTitle>
        <CardDescription>
          Tarkista ostoskorisi sisältö ja syötä toimitustiedot.
        </CardDescription>
      </CardHeader>
      <LoginWithCode />
      <CardContent>
        <form action={formAction}>
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
                name="shippingName"
                placeholder="Etunimi Sukunimi"
                required
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
                name="shippingAddress"
                placeholder="Katuosoite, Postinumero Postitoimipaikka"
                required
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
                name="notes"
                placeholder="Tilauksen lisätiedot..."
                required
              />
              {errors.notes && (
                <p id="notes-error" className="text-sm text-red-600 mt-1">
                  {errors.notes.join(', ')}
                </p>
              )}
            </div>
          </div>
          <input
            type="hidden"
            name="products"
            value={items
              .filter((item) => item.type === 'product')
              .map((item) => item.$id)}
          />
          <input
            type="hidden"
            name="bundles"
            value={items
              .filter((item) => item.type === 'bundle')
              .map((item) => item.$id)}
          />
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
