'use client';

import { createNewOrderCode } from '@/actions/orderCode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToastMessageStore } from '@/store';

import { useActionState, useEffect } from 'react';

const CreateNewCode = () => {
  const { addMessage } = useToastMessageStore();
  const [message, formAction] = useActionState(createNewOrderCode, null);

  useEffect(() => {
    if (message) {
      addMessage(message.message, message.type);
    }
  }, [message, addMessage]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-blue-500 text-white hover:bg-blue-600">
          Luo uusi koodi
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4">
        <form action={formAction} className="flex flex-col gap-4">
          <Label htmlFor="name">Nimi</Label>
          <Input type="text" name="name" placeholder="Syötä nimi" />
          <Label htmlFor="code">Koodi</Label>
          <Input type="text" name="code" placeholder="Syötä koodi" />
          <Label htmlFor="availableOrders">
            Maksimimäärä paketteja / tuotteita yhteensä
          </Label>
          <Input
            type="number"
            name="availableOrders"
            placeholder="Syötä tilaukset"
          />
          <Button
            type="submit"
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Luo uusi koodi
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default CreateNewCode;
