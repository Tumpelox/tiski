"use server";

import { loginWithCode } from "@/services/orderCode";
import { createTokenSession } from "@/services/userSession";
import { redirect } from "next/navigation";

// Uudelleenohjaukset kuntoon

export async function handleCodeLogin(formData: FormData) {
  const code = formData.get("code") as string;

  if (!code) {
    redirect("/login");
  }

  const { secret, userId } = await loginWithCode(code);

  if (!secret || !userId) {
    redirect("/login");
  }

  await createTokenSession(userId, secret);

  redirect("/");
}
