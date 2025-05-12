'use client';

import { signOut } from '@/actions/auth';
import { useToastMessageStore } from '@/store';

import { Models } from 'node-appwrite';
import CloudButton from './CloudButton';

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
    <CloudButton backgroundColor="white" button={{ onClick: handleSignOut }}>
      KIRJAUDU ULOS
    </CloudButton>
  );
};

export default SignOutButton;
