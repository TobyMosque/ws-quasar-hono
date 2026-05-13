import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { and, count, db, desc, eq, isNotNull, like, or, schema } from "db";

const CompanySchema = z.object({
  id: z.number(),
  name: z.string(),
  logoUrl: z.string().nullable(),
  website: z.string().nullable(),
});

const TechnologySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const JobSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  workplace: z.enum(["remote", "hybrid", "onsite"]),
  workType: z.enum(["full-time", "part-time", "contract"]),
  seniority: z.enum(["junior", "mid", "senior"]),
  country: z.string().nullable(),
  city: z.string().nullable(),
  salaryMin: z.number().nullable(),
  salaryMax: z.number().nullable(),
  isFeatured: z.boolean().nullable(),
  publishedAt: z.string().nullable(),
  company: CompanySchema,
  technologies: z.array(TechnologySchema),
});

const FiltersSchema = z.object({
  workplace: z.enum(["remote", "hybrid", "onsite"]).optional(),
  workType: z.enum(["full-time", "part-time", "contract"]).optional(),
  seniority: z.enum(["junior", "mid", "senior"]).optional(),
  country: z.string().optional(),
  salaryDisclosed: z
    .string()
    .transform(v => v === "true")
    .optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

const listRoute = createRoute({
  method: "get",
  path: "/jobs",
  request: { query: FiltersSchema },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            data: z.array(JobSchema),
            total: z.number(),
            page: z.number(),
            limit: z.number(),
          }),
        },
      },
      description: "Paginated list of jobs",
    },
  },
});

const getRoute = createRoute({
  method: "get",
  path: "/jobs/{id}",
  request: {
    params: z.object({ id: z.coerce.number().int() }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: JobSchema } },
      description: "Job details",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
      description: "Not found",
    },
  },
});

function buildWhere(filters: z.output<typeof FiltersSchema>) {
  const { workplace, workType, seniority, country, salaryDisclosed, q } =
    filters;

  return and(
    workplace ? eq(schema.jobs.workplace, workplace) : undefined,
    workType ? eq(schema.jobs.workType, workType) : undefined,
    seniority ? eq(schema.jobs.seniority, seniority) : undefined,
    country ? eq(schema.jobs.country, country) : undefined,
    salaryDisclosed ? isNotNull(schema.jobs.salaryMin) : undefined,
    q
      ? or(
          like(schema.jobs.title, `%${q}%`),
          like(schema.jobs.description, `%${q}%`)
        )
      : undefined
  );
}

function serializeJob(
  job: Awaited<ReturnType<typeof db.query.jobs.findMany>>[number]
) {
  return {
    ...job,
    publishedAt: job.publishedAt?.toISOString() ?? null,
    technologies: job.technologies.map(jt => jt.technology),
  };
}

export const jobsRouter = new OpenAPIHono()
  .openapi(listRoute, async c => {
    const filters = c.req.valid("query");
    const where = buildWhere(filters);
    const offset = (filters.page - 1) * filters.limit;

    const [jobs, [{ total }]] = await Promise.all([
      db.query.jobs.findMany({
        where,
        with: { company: true, technologies: { with: { technology: true } } },
        orderBy: [desc(schema.jobs.isFeatured), desc(schema.jobs.publishedAt)],
        limit: filters.limit,
        offset,
      }),
      db.select({ total: count() }).from(schema.jobs).where(where),
    ]);

    return c.json({
      data: jobs.map(serializeJob),
      total,
      page: filters.page,
      limit: filters.limit,
    });
  })
  .openapi(getRoute, async c => {
    const { id } = c.req.valid("param");

    const job = await db.query.jobs.findFirst({
      where: eq(schema.jobs.id, id),
      with: { company: true, technologies: { with: { technology: true } } },
    });

    if (!job) return c.json({ message: "Not found" }, 404);

    return c.json(serializeJob(job));
  });
