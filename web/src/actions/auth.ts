'use server';

import { codeSchema, emailSchema, passwordSchema } from '@/lib/schemas';
import { loginWithCode } from '@/services/orderCode';
import {
  createEmailAndPasswordSession,
  createTokenSession,
} from '@/services/userSession';
import { ToastType } from '@/store';

// Uudelleenohjaukset kuntoon

export async function handleCodeLogin(
  _prevState: { message: string; type: ToastType } | null | undefined,
  formData: FormData
) {
  const code = codeSchema.safeParse(formData.get('code') as string);

  if (code.success === false) {
    return { message: 'Virheellinen pyyntö', type: ToastType.ERROR };
  }

  try {
    const { secret, userId } = await loginWithCode(code.data);

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
  _prevState: { message: string; type: ToastType } | null | undefined,
  formData: FormData
) {
  const email = emailSchema.safeParse(formData.get('email') as string);
  const password = passwordSchema.safeParse(formData.get('password') as string);
  if (email.success === false || password.success === false)
    return { message: 'Virheellinen pyyntö', type: ToastType.ERROR };

  try {
    await createEmailAndPasswordSession(email.data, password.data);

    return {
      message: 'Kirjautuminen onnistui',
      type: ToastType.SUCCESS,
    };
  } catch (error) {
    console.error('Error creating session:', error);
    return { message: 'Kirjautuminen epäonnistui', type: ToastType.ERROR };
  }
}
