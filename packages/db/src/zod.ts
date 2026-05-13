import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import * as schema from "./schema.ts";

export const CompanySchema = createSelectSchema(schema.companies);

export const TechnologySchema = createSelectSchema(schema.technologies).pick({
  id: true,
  name: true,
});

export const JobBaseSchema = createSelectSchema(schema.jobs, {
  publishedAt: z.string().nullable(),
}).omit({ companyId: true, createdAt: true });

export type Company = z.infer<typeof CompanySchema>;
export type Technology = z.infer<typeof TechnologySchema>;
export type JobBase = z.infer<typeof JobBaseSchema>;
