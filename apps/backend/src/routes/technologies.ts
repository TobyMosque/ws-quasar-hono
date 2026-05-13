import { Hono } from "hono";
import { db, schema } from "db";

export const technologiesRouter = new Hono()
  .get("/", async c => {
    const techs = await db.select().from(schema.technologies);
    return c.json(techs);
  });
