import { auth } from "@/lib/auth";
import { Hono } from "hono";
import { headers } from "next/headers";

const app = new Hono()
  .get("/", (c) => c.json({ result: "hello world" }))
  .get("/testAuth", async (c) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ session });
  });

export default app;
