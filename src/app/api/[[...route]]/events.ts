import { db } from "@/db";
import { calendarEvents } from "@/db/schema";
import { auth } from "@/lib/auth";
import { zValidator } from "@hono/zod-validator";
import { eq, and } from "drizzle-orm";
import { Hono } from "hono";
import { headers } from "next/headers";
import { z } from "zod";

const app = new Hono()
  .get("/", async (c) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return c.text("Unauthorized", 401);
    }

    // Get all events for the user
    const events = await db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.userId, session.user.id));

    // Get unique courses with their colors
    const uniqueCourses = Array.from(
      new Set(
        events
          .map((event) => event.courseCode)
          .filter((code): code is string => code !== null)
      )
    ).map((courseCode) => ({
      code: courseCode,
      // Generate a consistent color based on the course code
      color: `hsl(${
        courseCode
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
      }, 70%, 50%)`,
    }));

    return c.json({ events, courses: uniqueCourses }, 200);
  })
  .get(
    "/:courseCode",
    zValidator("param", z.object({ courseCode: z.string() })),
    async (c) => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        return c.text("Unauthorized", 401);
      }

      const { courseCode } = c.req.valid("param");
      console.log("courseCode", courseCode);

      // Get events for the specific course
      const events = await db
        .select()
        .from(calendarEvents)
        .where(
          and(
            eq(calendarEvents.userId, session.user.id),
            eq(calendarEvents.courseCode, courseCode)
          )
        );

      if (events.length === 0) {
        return c.json({ error: "No events found for this course" }, 404);
      }

      // Get the course color
      const color = `hsl(${
        courseCode
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
      }, 70%, 50%)`;

      return c.json({ events, course: { code: courseCode, color } }, 200);
    }
  );

export default app;
