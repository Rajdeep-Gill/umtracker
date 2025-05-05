import { db } from "@/db";
import { sync } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { headers } from "next/headers";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono()
  .get("/", async (c) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return c.text("Unauthorized", 401);
    }
    // Check if a row exists for given user
    const data = await db
      .select()
      .from(sync)
      .where(eq(sync.userId, session.user.id));

    if (data.length === 0) {
      // We need to create a new row for said user
      return c.json({ sync: false }, 200);
    }

    // Already have a row for said user
    return c.json({ sync: true }, 200);
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        url: z.string().url(),
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      // Check if the user is authenticated
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session) {
        return c.text("Unauthorized", 401);
      }

      const data = await db
        .insert(sync)
        .values({
          userId: session.user.id,
          calendarLink: values.url,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: sync.userId,
          set: {
            calendarLink: values.url,
            updatedAt: new Date(),
          },
        });

      return c.json({ data }, 200);
    }
  );

export default app;
