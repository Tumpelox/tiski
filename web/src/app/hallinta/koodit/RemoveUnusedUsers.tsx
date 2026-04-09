'use client';

import { deleteUnusedUsers } from '@/actions/orderCode';
import { Button } from '@/components/ui/button';
import { ToastType, useToastMessageStore } from '@/store';
import { useRouter } from 'next/navigation';

const RemoveUnusedUsers = () => {
  const addMessage = useToastMessageStore((state) => state.addMessage);
  const router = useRouter();

  const onSubmit = async () => {
    if (
      window.confirm(
        'Haluatko varmasti poistaa käyttämättömät käyttäjät? Tämä poistaa kaikki käyttäjät, jotka eivät ole kirjautuneet sisään viimeiseen 30 päivään.'
      )
    ) {
      const result = await deleteUnusedUsers();

      if (result) {
        addMessage(result.message, result.type);
        if (result.type === ToastType.SUCCESS) {
          router.refresh();
        }
      }
    }
  };

  return (
    <Button variant={'destructive'} onClick={() => onSubmit()}>
      Poista käyttämättömät käyttäjät
    </Button>
  );
};

export default RemoveUnusedUsers;
