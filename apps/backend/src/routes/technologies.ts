import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { db, schema } from "db";

const listRoute = createRoute({
  method: "get",
  path: "/technologies",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(z.object({ id: z.number(), name: z.string() })),
        },
      },
      description: "All technologies",
    },
  },
});

export const technologiesRouter = new OpenAPIHono().openapi(
  listRoute,
  async c => {
    const techs = await db.select().from(schema.technologies);
    return c.json(techs);
  }
);
