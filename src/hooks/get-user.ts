import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const user = session.user;
  const sessionData = session.session;

  return {
    user,
    session: sessionData,
  };
};
