import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    console.log("No session found");
    return null;
  }

  const user = session.user;
  const sessionData = session.session;
  // console.log("Returning user data:", { user, sessionData });
  return {
    user,
    session: sessionData,
  };
};
