'use server';

import { loginWithCode } from '@/services/orderCode';
import {
  createEmailAndPasswordSession,
  createTokenSession,
} from '@/services/userSession';
import { ToastType } from '@/store';
import { deleteSession } from '@/services/userSession';
import { z } from 'zod';
import { emailAndPassword, orderCodeSchema } from '@/schemas/auth.schema';

// Uudelleenohjaukset kuntoon

export async function handleCodeLogin(
  loginData: z.infer<typeof orderCodeSchema>
) {
  const { data, success } = orderCodeSchema.safeParse(loginData);

  if (success === false) {
    return { message: 'Virheellinen pyyntö', type: ToastType.ERROR };
  }

  try {
    await deleteSession();

    const { secret, userId } = await loginWithCode(data.code);

    if (!secret || !userId) {
      return { message: 'Koodia ei löytynyt', type: ToastType.ERROR };
    }

    await createTokenSession(userId, secret);

    return {
      message: 'Kirjautuminen onnistui',
      type: ToastType.SUCCESS,
    };
  } catch (error) {
    console.error('Error creating session:', error);
    return { message: 'Kirjautuminen epäonnistui', type: ToastType.ERROR };
  }
}

export async function loginWithEmailAndPasword(
  loginData: z.infer<typeof emailAndPassword>
) {
  const { data, success } = emailAndPassword.safeParse(loginData);
  if (success === false)
    return { message: 'Virheellinen pyyntö', type: ToastType.ERROR };

  try {
    await deleteSession();

    await createEmailAndPasswordSession(data.email, data.password);

    return {
      message: 'Kirjautuminen onnistui',
      type: ToastType.SUCCESS,
    };
  } catch (error) {
    console.error('Error creating session:', error);
    return { message: 'Kirjautuminen epäonnistui', type: ToastType.ERROR };
  }
}

export async function signOut() {
  try {
    await deleteSession();
    return { message: 'Kirjauduttu ulos', type: ToastType.SUCCESS };
  } catch (error) {
    console.error('Error during sign out:', error);
    return { message: 'Uloskirjautuminen epäonnistui', type: ToastType.ERROR };
  }
}
