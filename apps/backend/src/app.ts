import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { jobsRouter } from "./routes/jobs.ts";
import { technologiesRouter } from "./routes/technologies.ts";

const api = new OpenAPIHono().basePath("/api");

const healthRoute = createRoute({
  method: "get",
  path: "/health",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ status: z.literal("ok") }),
        },
      },
      description: "Health check",
    },
  },
});

const routes = api
  .openapi(healthRoute, c => c.json({ status: "ok" }))
  .route("/", jobsRouter)
  .route("/", technologiesRouter);

api.doc("/openapi.json", {
  openapi: "3.0.0",
  info: { title: "Backend API", version: "0.0.1" },
});

const app = new Hono();
app.route("/", api);
app.get("/scalar", apiReference({ url: "/api/openapi.json" }));

export type AppType = typeof routes;
export default app;
