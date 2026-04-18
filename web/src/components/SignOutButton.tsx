'use client';

import { signOut } from '@/actions/auth';
import { useToastMessageStore } from '@/store';

import { Models } from 'node-appwrite';
import { CloudButton } from './CloudButton';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

type SignOutButtonProps = {
  user: Models.User<Models.Preferences> | null;
};

const SignOutButton = ({ user }: SignOutButtonProps) => {
  const { addMessage } = useToastMessageStore();
  const handleSignOut = async () => {
    const result = await signOut();
    if (result) addMessage(result.message, result.type);
  };

  if (!user) {
    return null; // Don't render the button if the user is not logged in
  }

  return (
    <button
      onClick={handleSignOut}
      className={cn(
        'flex gap-2 text-xl text-destructive font-semibold mt-2 items-center',
        {
          'md:w-32 md:w-3 md:mt-0': false,
        }
      )}
      title="Kirjaudu ulos"
    >
      Kirjaudu ulos
      <LogOut className="size-6 text-destructive" />
    </button>
  );
};

export default SignOutButton;
