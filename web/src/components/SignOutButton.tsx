'use client';

import { signOut } from '@/actions/auth';
import { useToastMessageStore } from '@/store';

import { Models } from 'node-appwrite';
import { CloudButton } from './CloudButton';
import { LogOut } from 'lucide-react';

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
    <CloudButton variant="accent" onClick={handleSignOut} className="md:w-36">
      <LogOut className="size-6 text-destructive" />
    </CloudButton>
  );
};

export default SignOutButton;
