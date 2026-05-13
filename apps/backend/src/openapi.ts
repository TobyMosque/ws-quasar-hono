import { CompanySchema, JobBaseSchema, TechnologySchema } from "db";
import { Type } from "@sinclair/typebox";
import { FiltersSchema, IdParamSchema, JobSchema } from "./routes/jobs.ts";

const JobListResponseSchema = Type.Object({
  data:  Type.Array(JobSchema),
  total: Type.Number(),
  page:  Type.Number(),
  limit: Type.Number(),
});

function schemaRef(name: string) {
  return { $ref: `#/components/schemas/${name}` };
}

function queryParam(name: string, schema: object, required = false) {
  return { name, in: "query", required, schema };
}

export default {
  openapi: "3.0.0",
  info: { title: "Backend API", version: "0.0.1" },
  components: {
    schemas: {
      Company:         CompanySchema,
      Technology:      TechnologySchema,
      JobBase:         JobBaseSchema,
      Job:             JobSchema,
      JobListResponse: JobListResponseSchema,
      Filters:         FiltersSchema,
      IdParam:         IdParamSchema,
    },
  },
  paths: {
    "/api/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
            description: "OK",
            content: { "application/json": { schema: { type: "object", properties: { status: { type: "string", enum: ["ok"] } } } } },
          },
        },
      },
    },
    "/api/jobs": {
      get: {
        summary: "List jobs",
        parameters: [
          queryParam("workplace",       { type: "string", enum: ["remote", "hybrid", "onsite"] }),
          queryParam("workType",        { type: "string", enum: ["full-time", "part-time", "contract"] }),
          queryParam("seniority",       { type: "string", enum: ["junior", "mid", "senior"] }),
          queryParam("country",         { type: "string" }),
          queryParam("salaryDisclosed", { type: "boolean" }),
          queryParam("q",               { type: "string" }),
          queryParam("page",            { type: "integer", minimum: 1, default: 1 }),
          queryParam("limit",           { type: "integer", minimum: 1, maximum: 100, default: 25 }),
        ],
        responses: {
          "200": {
            description: "Paginated list of jobs",
            content: { "application/json": { schema: schemaRef("JobListResponse") } },
          },
        },
      },
    },
    "/api/jobs/{id}": {
      get: {
        summary: "Get job by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Job details",
            content: { "application/json": { schema: schemaRef("Job") } },
          },
          "404": {
            description: "Not found",
            content: { "application/json": { schema: { type: "object", properties: { message: { type: "string" } } } } },
          },
        },
      },
    },
    "/api/technologies": {
      get: {
        summary: "List technologies",
        responses: {
          "200": {
            description: "All technologies",
            content: { "application/json": { schema: { type: "array", items: schemaRef("Technology") } } },
          },
        },
      },
    },
  },
};
