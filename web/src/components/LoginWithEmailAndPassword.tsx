'use client';

import { loginWithEmailAndPasword } from '@/actions/auth';
import { ToastType, useToastMessageStore } from '@/store';
import { redirect } from 'next/navigation';

import { useActionState, useEffect } from 'react';

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
    <div>
      <h1>Kirjautuminen</h1>
      <form action={formAction}>
        <div>
          <label htmlFor="username">Sähköposti</label>
          <input type="email" id="email" name="email" autoComplete="email" />
        </div>
        <div>
          <label htmlFor="password">Salasana</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Kirjaudu</button>
      </form>
    </div>
  );
};

export default LoginWithEmailAndPassword;
