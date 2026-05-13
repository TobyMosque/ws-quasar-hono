import { serve } from "@hono/node-server";
import app from "./app.ts";

serve({ fetch: app.fetch, port: 3000 }, ({ port }) => {
  console.log(`Server running at http://localhost:${port}`);
});
