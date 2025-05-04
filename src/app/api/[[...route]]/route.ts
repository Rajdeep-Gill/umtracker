import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "./auth";
import hello from "./hello";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app.route("/auth", auth).route("/hello", hello);

export const GET = handle(app);
export const POST = handle(app);

export default app;

export type AppType = typeof routes;
