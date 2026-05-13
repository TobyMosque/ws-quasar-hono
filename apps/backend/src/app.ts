import { apiReference } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { jobsRouter } from "./routes/jobs.ts";
import { technologiesRouter } from "./routes/technologies.ts";
import openApiDoc from "./openapi.ts";

const api = new Hono().basePath("/api");

const routes = api
  .get("/health", c => c.json({ status: "ok" as const }))
  .get("/openapi.json", c => c.json(openApiDoc))
  .route("/jobs", jobsRouter)
  .route("/technologies", technologiesRouter);

const app = new Hono();
app.route("/", api);
app.get("/scalar", apiReference({ url: "/api/openapi.json" }));

export type AppType = typeof routes;
export default app;
