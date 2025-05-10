'use client';

import { createNewOrderCode } from '@/actions/orderCode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <div className="">
      <form action={formAction} className="flex flex-col gap-4">
        <Label htmlFor="name">Nimi</Label>
        <Input type="text" name="name" placeholder="Syötä nimi" />
        <Label htmlFor="code">Koodi</Label>
        <Input type="text" name="code" placeholder="Syötä koodi" />
        <Label htmlFor="availableOrders">Käytettävissä olevat tilaukset</Label>
        <Input
          type="number"
          name="availableOrders"
          placeholder="Syötä tilaukset"
        />
        <Button type="submit">Luo uusi koodi</Button>
      </form>
    </div>
  );
};

export default CreateNewCode;
