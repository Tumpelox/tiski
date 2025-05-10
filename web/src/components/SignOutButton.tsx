'use client';

import { signOut } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { useToastMessageStore } from '@/store';

import { Models } from 'node-appwrite';

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
    <Button onClick={handleSignOut} className="absolute top-4 left-4">
      Kirjaudu ulos
    </Button>
  );
};

export default SignOutButton;
