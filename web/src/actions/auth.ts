'use server';

import { loginWithCode } from '@/services/orderCode';
import { createTokenSession } from '@/services/userSession';
import { ToastType } from '@/store';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Uudelleenohjaukset kuntoon

export const codeSchema = z
  .string()
  .min(3)
  .max(16)
  .regex(/^[a-zA-Z0-9]+$/);

export async function handleCodeLogin(formData: FormData) {
  const code = codeSchema.safeParse(formData.get('code') as string);

  if (code.success === false) {
    return { message: 'Koodia ei löytynyt', type: ToastType.ERROR };
  }

  const { secret, userId } = await loginWithCode(code.data);

  if (!secret || !userId) {
    return { message: 'Koodia ei löytynyt', type: ToastType.ERROR };
  }

  await createTokenSession(userId, secret);

  redirect('/');
}
