import { Type, type Static } from "@sinclair/typebox";
import { Hono } from "hono";
import { and, count, db, desc, eq, isNotNull, like, or, schema } from "db";
import { CompanySchema, JobBaseSchema, TechnologySchema } from "db";
import { tbValidator } from "../lib/validator.ts";

export const FiltersSchema = Type.Object({
  workplace:      Type.Optional(Type.Union([Type.Literal("remote"), Type.Literal("hybrid"), Type.Literal("onsite")])),
  workType:       Type.Optional(Type.Union([Type.Literal("full-time"), Type.Literal("part-time"), Type.Literal("contract")])),
  seniority:      Type.Optional(Type.Union([Type.Literal("junior"), Type.Literal("mid"), Type.Literal("senior")])),
  country:        Type.Optional(Type.String()),
  salaryDisclosed: Type.Optional(Type.Boolean()),
  q:              Type.Optional(Type.String()),
  page:           Type.Optional(Type.Number({ minimum: 1, default: 1 })),
  limit:          Type.Optional(Type.Number({ minimum: 1, maximum: 100, default: 25 })),
});

export const IdParamSchema = Type.Object({
  id: Type.Number({ minimum: 1 }),
});

export const JobSchema = Type.Composite([
  JobBaseSchema,
  Type.Object({
    company:      CompanySchema,
    technologies: Type.Array(TechnologySchema),
  }),
]);

export type Filters = Static<typeof FiltersSchema>;
export type Job     = Static<typeof JobSchema>;

function buildWhere(filters: Filters) {
  const { workplace, workType, seniority, country, salaryDisclosed, q } = filters;
  return and(
    workplace       ? eq(schema.jobs.workplace, workplace)           : undefined,
    workType        ? eq(schema.jobs.workType, workType)             : undefined,
    seniority       ? eq(schema.jobs.seniority, seniority)          : undefined,
    country         ? eq(schema.jobs.country, country)              : undefined,
    salaryDisclosed ? isNotNull(schema.jobs.salaryMin)              : undefined,
    q ? or(like(schema.jobs.title, `%${q}%`), like(schema.jobs.description, `%${q}%`)) : undefined
  );
}

function serializeJob(
  job: Awaited<ReturnType<typeof db.query.jobs.findMany>>[number]
): Job {
  return {
    ...job,
    publishedAt:  job.publishedAt?.toISOString() ?? null,
    technologies: job.technologies.map(jt => jt.technology),
  };
}

export const jobsRouter = new Hono()
  .get("/", tbValidator("query", FiltersSchema), async c => {
    const filters = c.req.valid("query");
    const page    = filters.page  ?? 1;
    const limit   = filters.limit ?? 25;
    const where   = buildWhere(filters);
    const offset  = (page - 1) * limit;

    const [jobs, [{ total }]] = await Promise.all([
      db.query.jobs.findMany({
        where,
        with: { company: true, technologies: { with: { technology: true } } },
        orderBy: [desc(schema.jobs.isFeatured), desc(schema.jobs.publishedAt)],
        limit,
        offset,
      }),
      db.select({ total: count() }).from(schema.jobs).where(where),
    ]);

    return c.json({ data: jobs.map(serializeJob), total, page, limit });
  })
  .get("/:id", tbValidator("param", IdParamSchema), async c => {
    const { id } = c.req.valid("param");

    const job = await db.query.jobs.findFirst({
      where: eq(schema.jobs.id, id),
      with: { company: true, technologies: { with: { technology: true } } },
    });

    if (!job) return c.json({ message: "Not found" }, 404);
    return c.json(serializeJob(job));
  });
