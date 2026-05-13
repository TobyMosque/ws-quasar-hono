import { relations } from "drizzle-orm";
import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const companies = sqliteTable("companies", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  logoUrl: text("logo_url"),
  website: text(),
});

export const jobs = sqliteTable("jobs", {
  id: int().primaryKey({ autoIncrement: true }),
  companyId: int("company_id")
    .notNull()
    .references(() => companies.id),
  title: text().notNull(),
  description: text().notNull(),
  workplace: text({ enum: ["remote", "hybrid", "onsite"] }).notNull(),
  workType: text("work_type", {
    enum: ["full-time", "part-time", "contract"],
  }).notNull(),
  seniority: text({ enum: ["junior", "mid", "senior"] }).notNull(),
  country: text(),
  city: text(),
  salaryMin: int("salary_min"),
  salaryMax: int("salary_max"),
  isFeatured: int("is_featured", { mode: "boolean" }).default(false),
  publishedAt: int("published_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  createdAt: int("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const technologies = sqliteTable("technologies", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
});

export const jobTechnologies = sqliteTable(
  "job_technologies",
  {
    jobId: int("job_id")
      .notNull()
      .references(() => jobs.id),
    technologyId: int("technology_id")
      .notNull()
      .references(() => technologies.id),
  },
  t => [primaryKey({ columns: [t.jobId, t.technologyId] })]
);

export const companiesRelations = relations(companies, ({ many }) => ({
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companies, { fields: [jobs.companyId], references: [companies.id] }),
  technologies: many(jobTechnologies),
}));

export const technologiesRelations = relations(technologies, ({ many }) => ({
  jobs: many(jobTechnologies),
}));

export const jobTechnologiesRelations = relations(jobTechnologies, ({ one }) => ({
  job: one(jobs, { fields: [jobTechnologies.jobId], references: [jobs.id] }),
  technology: one(technologies, {
    fields: [jobTechnologies.technologyId],
    references: [technologies.id],
  }),
}));
