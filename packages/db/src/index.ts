import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.ts";

import { resolve } from "node:path";

// Resolves to packages/db/local.db regardless of which app triggers this code.
// All app packages sit at depth 2 (apps/* or packages/*) from the workspace root.
const defaultUrl = `file:${resolve(process.cwd(), "../../packages/db/local.db")}`;

const client = createClient({
  url: process.env.DATABASE_URL ?? defaultUrl,
});

export const db = drizzle(client, { schema });
export { schema };
export { and, count, desc, eq, isNotNull, like, or } from "drizzle-orm";
export { CompanySchema, JobBaseSchema, TechnologySchema } from "./typebox.ts";
export type { Company, JobBase, Technology } from "./typebox.ts";
