import { Hono } from "hono";

const app = new Hono().get("/", (c) => c.json({ result: "hello world" }));

export default app;
