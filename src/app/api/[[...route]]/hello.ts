import { Hono } from "hono";

const app = new Hono();
app.get("/hi", (c) => {
  return c.json({
    message: "Hello from Hono!",
  });
});

export default app;
