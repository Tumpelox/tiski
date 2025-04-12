import { loginWithCode } from "@/services/orderCode";
import { createTokenSession } from "@/services/userSession";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ code: string }>;
}

const KooditPage = async ({ params }: Props) => {
  const { code } = await params;

  const { secret, userId } = await loginWithCode(code);

  if (!secret || !userId) {
    redirect("/login");
  }

  await createTokenSession(userId, secret);

  redirect("/");
};

export default KooditPage;
