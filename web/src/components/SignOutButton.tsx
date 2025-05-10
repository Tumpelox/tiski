'use client';

import { signOut } from '@/actions/auth';
import { Button } from '@/components/ui/button';

import { Models } from 'node-appwrite';

type SignOutButtonProps = {
  user: Models.User<Models.Preferences> | null;
};

const SignOutButton = ({ user }: SignOutButtonProps) => {
  const handleSignOut = async () => {
    const result = await signOut(null); // Pass `null` for `_prevState`
    console.log(result.message); // Optional: Handle the result (e.g., show a toast)
  };

  if (!user) {
    return null; // Don't render the button if the user is not logged in
  }

  return (
    <Button
      onClick={handleSignOut}
      className="absolute top-4 left-4 px-4 py-2 rounded-md z-50 bg-gray-100 border border-gray-400 text-gray-800 hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      Kirjaudu ulos
    </Button>
  );
};

export default SignOutButton;
