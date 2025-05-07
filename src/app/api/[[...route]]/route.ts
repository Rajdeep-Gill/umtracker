import { Hono } from "hono";
import { handle } from "hono/vercel";

import { auth } from "@/lib/auth";
import hi from "./hi";
import sync from "./sync";
import events from "./events";

export const runtime = "edge";

const authApp = new Hono()
  .get("/session", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      return c.json({ error: "No session found" }, 401);
    }

    return c.json(session);
  })
  .on(["POST", "GET"], "/*", (c) => auth.handler(c.req.raw));

const app = new Hono()
  .basePath("/api")
  .get("/helloworld", (c) => c.json({ hello: "world" }))
  .route("/hello", hi)
  .route("/auth", authApp)
  .route("/sync", sync)
  .route("/events", events);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof app;
