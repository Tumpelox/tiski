'use client';

import { loginWithEmailAndPasword } from '@/actions/auth';
import { ToastType, useToastMessageStore } from '@/store';
import { redirect } from 'next/navigation';

import { useActionState, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LoginWithEmailAndPassword = () => {
  const [message, formAction] = useActionState(loginWithEmailAndPasword, null);
  const { addMessage } = useToastMessageStore();

  useEffect(() => {
    if (message) {
      addMessage(message.message, message.type);
      if (message.type === ToastType.SUCCESS) redirect('/');
    }
  }, [message, addMessage]);

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-4">
      <div className="w-full max-w-md">
        <h1 className="text-5xl font-bold text-center mb-8">Kirjautuminen</h1>
        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Sähköposti
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              className="mt-1 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Salasana
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              className="mt-1 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-center">
            <Button type="submit" className="w-full max-w-xs">
              Kirjaudu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginWithEmailAndPassword;
